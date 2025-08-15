import { NextFunction, Response } from 'express';
import { CognitoIdentityProviderClient, GetUserCommand, AdminListGroupsForUserCommand } from '@aws-sdk/client-cognito-identity-provider';
import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_COGNITO_USER_POOL_ID } from "@config";
import { HttpException } from '@exceptions/HttpException';

const cognitoClient = new CognitoIdentityProviderClient({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID || '',
    secretAccessKey: AWS_SECRET_ACCESS_KEY || '',
  },
});

const USER_POOL_ID = AWS_COGNITO_USER_POOL_ID;
const ALLOWED_GROUPS = ['AppLogAssistencia', 'AppLogFullIntranet'];

interface CognitoUser {
  sub: string;
  username?: string;
  email: string;
  email_verified: boolean;
  name?: string;
  groups?: string[];
  [key: string]: any;
}

const getTokenFromRequest = (req: any): string | null => {
  const authorization = req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);
  return authorization;
};

const validateCognitoToken = async (token: string): Promise<CognitoUser | null> => {
  try {
    const command = new GetUserCommand({
      AccessToken: token,
    });

    const response = await cognitoClient.send(command);

    if (!response.UserAttributes) {
      return null;
    }

    const user: CognitoUser = {
      sub: '',
      email: '',
      email_verified: false,
      username: response.Username || '',
    };

    response.UserAttributes.forEach(attr => {
      if (attr.Name && attr.Value) {
        switch (attr.Name) {
          case 'sub':
            user.sub = attr.Value;
            break;
          case 'email':
            user.email = attr.Value;
            break;
          case 'email_verified':
            user.email_verified = attr.Value === 'true';
            break;
          case 'name':
            user.name = attr.Value;
            break;
          default:
            user[attr.Name] = attr.Value;
        }
      }
    });

    return user;
  } catch (error) {
    console.error('Erro ao validar token Cognito:', error);
    return null;
  }
};

const getUserGroups = async (username: string): Promise<string[]> => {
  try {
    const command = new AdminListGroupsForUserCommand({
      UserPoolId: USER_POOL_ID,
      Username: username,
    });

    const response = await cognitoClient.send(command);
    const groups = response.Groups?.map(group => group.GroupName || '') || [];

    return groups.filter(group => group !== '');
  } catch (error: any) {
    console.error('Erro ao buscar grupos do usuário:', error);

    if (error.name === 'UserNotFoundException') {
      console.log('Usuário não encontrado com o username fornecido:', username);
    }

    return [];
  }
};

const hasRequiredGroup = (userGroups: string[]): boolean => {
  return userGroups.some(group => ALLOWED_GROUPS.includes(group));
};

export const cognitoAuthMiddleware = async (req: any, res: Response, next: NextFunction) => {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      return next(new HttpException(401, 'Token de autenticação não fornecido'));
    }

    const cognitoUser = await validateCognitoToken(token);

    if (!cognitoUser) {
      return next(new HttpException(401, 'Token de autenticação inválido'));
    }

    const userGroups = await getUserGroups(cognitoUser.username || cognitoUser.sub);

    if (!hasRequiredGroup(userGroups)) {
      console.log(`Acesso negado para usuário ${cognitoUser.sub}. Grupos: ${userGroups.join(', ')}`);
      return next(new HttpException(403, 'Usuário não possui permissão para acessar esta API'));
    }

    req.cognitoUser = {
      ...cognitoUser,
      groups: userGroups,
    };

    next();
  } catch (error) {
    console.error('Erro no middleware Cognito:', error);
    next(new HttpException(500, 'Erro interno na autenticação'));
  }
};

export const optionalCognitoAuthMiddleware = async (req: any, res: Response, next: NextFunction) => {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      req.cognitoUser = null;
      return next();
    }

    const cognitoUser = await validateCognitoToken(token);

    if (cognitoUser) {
      const userGroups = await getUserGroups(cognitoUser.username || cognitoUser.sub);
      req.cognitoUser = {
        ...cognitoUser,
        groups: userGroups,
      };
    } else {
      req.cognitoUser = null;
    }

    next();
  } catch (error) {
    console.error('Erro no middleware opcional Cognito:', error);
    req.cognitoUser = null;
    next();
  }
};

export const requireGroups = (requiredGroups: string[]) => {
  return async (req: any, res: Response, next: NextFunction) => {
    if (!req.cognitoUser || !req.cognitoUser.groups) {
      return next(new HttpException(401, 'Usuário não autenticado'));
    }

    const userGroups = req.cognitoUser.groups;
    const hasAnyRequiredGroup = requiredGroups.some(group => userGroups.includes(group));

    if (!hasAnyRequiredGroup) {
      console.log(`Acesso negado. Grupos necessários: ${requiredGroups.join(', ')}, Grupos do usuário: ${userGroups.join(', ')}`);
      return next(new HttpException(403, `Acesso negado. Grupos necessários: ${requiredGroups.join(', ')}`));
    }

    next();
  };
};
