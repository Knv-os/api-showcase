import {
  CognitoIdentityProviderClient,
  AdminInitiateAuthCommand,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  AdminAddUserToGroupCommand,
  AdminGetUserCommand,
  AdminListGroupsForUserCommand,
  ListUsersCommand,
  AdminDeleteUserCommand,
  ChangePasswordCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand
} from '@aws-sdk/client-cognito-identity-provider';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import { SESSION_EXPIRES, AWS_REGION, AWS_COGNITO_CLIENT_ID, AWS_COGNITO_CLIENT_SECRET, AWS_COGNITO_USER_POOL_ID } from '@config';
import {
  CognitoUserProfile,
  CognitoAuthResponse
} from '@apis/users_cognito/interfaces/users_cognito.interface';

class UsersCognitoService {
  private cognitoClient: CognitoIdentityProviderClient;
  private readonly userPoolId = AWS_COGNITO_USER_POOL_ID;
  private readonly clientId = AWS_COGNITO_CLIENT_ID;
  private readonly clientSecret = AWS_COGNITO_CLIENT_SECRET;

  constructor() {
    this.cognitoClient = new CognitoIdentityProviderClient({
      region: AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
  }

  public async authenticateUser(email: string, password: string): Promise<CognitoAuthResponse> {
    if (isEmpty(email) || isEmpty(password)) {
      throw new HttpException(400, 'Email e senha são obrigatórios');
    }

    try {
      const command = new AdminInitiateAuthCommand({
        UserPoolId: this.userPoolId,
        ClientId: this.clientId,
        AuthFlow: 'ADMIN_NO_SRP_AUTH',
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
          SECRET_HASH: this.generateSecretHash(email),
        },
      });

      const response = await this.cognitoClient.send(command);

      if (!response.AuthenticationResult) {
        throw new HttpException(401, 'Falha na autenticação');
      }

      const userProfile = await this.getUserProfile(email);
      const cookie = this.createCookie(response.AuthenticationResult.AccessToken || '');

      return {
        user: userProfile,
        accessToken: response.AuthenticationResult.AccessToken || '',
        refreshToken: response.AuthenticationResult.RefreshToken,
        idToken: response.AuthenticationResult.IdToken,
        cookie,
      };
    } catch (error: any) {
      console.error('Erro na autenticação:', error);

      if (error.name === 'NotAuthorizedException') {
        throw new HttpException(401, 'Email ou senha inválidos');
      } else if (error.name === 'UserNotConfirmedException') {
        throw new HttpException(401, 'Usuário não confirmado');
      } else if (error.name === 'PasswordResetRequiredException') {
        throw new HttpException(401, 'Reset de senha obrigatório');
      } else if (error.name === 'UserNotFoundException') {
        throw new HttpException(404, 'Usuário não encontrado');
      }

      throw new HttpException(500, 'Erro interno na autenticação');
    }
  }

  public async getUserProfile(username: string): Promise<CognitoUserProfile> {
    try {
      const command = new AdminGetUserCommand({
        UserPoolId: this.userPoolId,
        Username: username,
      });

      const response = await this.cognitoClient.send(command);

      if (!response.UserAttributes) {
        throw new HttpException(404, 'Usuário não encontrado');
      }

      const userGroups = await this.getUserGroups(username);

      const profile: CognitoUserProfile = {
        id: response.Username || '',
        email: '',
        emailVerified: false,
        groups: userGroups,
        attributes: {},
      };

      response.UserAttributes.forEach(attr => {
        if (attr.Name && attr.Value) {
          switch (attr.Name) {
            case 'email':
              profile.email = attr.Value;
              break;
            case 'email_verified':
              profile.emailVerified = attr.Value === 'true';
              break;
            case 'name':
              profile.name = attr.Value;
              break;
            default:
              if (profile.attributes) {
                profile.attributes[attr.Name] = attr.Value;
              }
          }
        }
      });

      return profile;
    } catch (error: any) {
      console.error('Erro ao buscar perfil do usuário:', error);
      throw new HttpException(500, 'Erro ao buscar perfil do usuário');
    }
  }

  public async createUser(email: string, name: string, password: string, groupName?: string): Promise<CognitoUserProfile> {
    if (isEmpty(email) || isEmpty(name) || isEmpty(password)) {
      throw new HttpException(400, 'Email, nome e senha temporária são obrigatórios');
    }

    const Username = email.split('@')[0];

    try {
      const createCommand = new AdminCreateUserCommand({
        UserPoolId: this.userPoolId,
        Username,
        UserAttributes: [
          { Name: 'email', Value: email },
          { Name: 'name', Value: name },
          { Name: 'email_verified', Value: 'true' },
        ],
        MessageAction: 'SUPPRESS',
      });

      await this.cognitoClient.send(createCommand);

      const setPasswordCommand = new AdminSetUserPasswordCommand({
        UserPoolId: this.userPoolId,
        Username,
        Password: password,
        Permanent: true,
      });

      await this.cognitoClient.send(setPasswordCommand);

      if (groupName) {
        const addToGroupCommand = new AdminAddUserToGroupCommand({
          UserPoolId: this.userPoolId,
          Username,
          GroupName: groupName,
        });

        await this.cognitoClient.send(addToGroupCommand);
      }

      return await this.getUserProfile(email);
    } catch (error: any) {
      console.error('Erro ao criar usuário:', error);

      if (error.name === 'UsernameExistsException') {
        throw new HttpException(409, 'Usuário já existe');
      }

      throw new HttpException(500, 'Erro ao criar usuário');
    }
  }

  public async changePassword(accessToken: string, oldPassword: string, newPassword: string): Promise<void> {
    if (isEmpty(oldPassword) || isEmpty(newPassword)) {
      throw new HttpException(400, 'Senha atual e nova senha são obrigatórias');
    }

    try {
      const command = new ChangePasswordCommand({
        AccessToken: accessToken,
        PreviousPassword: oldPassword,
        ProposedPassword: newPassword,
      });

      await this.cognitoClient.send(command);
    } catch (error: any) {
      console.error('Erro ao alterar senha:', error);

      if (error.name === 'NotAuthorizedException') {
        throw new HttpException(401, 'Senha atual incorreta');
      }

      throw new HttpException(500, 'Erro ao alterar senha');
    }
  }

  public async forgotPassword(email: string): Promise<void> {
    if (isEmpty(email)) {
      throw new HttpException(400, 'Email é obrigatório');
    }

    try {
      const command = new ForgotPasswordCommand({
        ClientId: this.clientId,
        Username: email,
        SecretHash: this.generateSecretHash(email),
      });

      await this.cognitoClient.send(command);
    } catch (error: any) {
      console.error('Erro ao solicitar reset de senha:', error);
      throw new HttpException(500, 'Erro ao solicitar reset de senha');
    }
  }

  public async confirmForgotPassword(email: string, confirmationCode: string, newPassword: string): Promise<void> {
    if (isEmpty(email) || isEmpty(confirmationCode) || isEmpty(newPassword)) {
      throw new HttpException(400, 'Email, código de confirmação e nova senha são obrigatórios');
    }

    try {
      const command = new ConfirmForgotPasswordCommand({
        ClientId: this.clientId,
        Username: email,
        ConfirmationCode: confirmationCode,
        Password: newPassword,
        SecretHash: this.generateSecretHash(email),
      });

      await this.cognitoClient.send(command);
    } catch (error: any) {
      console.error('Erro ao confirmar reset de senha:', error);

      if (error.name === 'CodeMismatchException') {
        throw new HttpException(400, 'Código de confirmação inválido');
      } else if (error.name === 'ExpiredCodeException') {
        throw new HttpException(400, 'Código de confirmação expirado');
      }

      throw new HttpException(500, 'Erro ao confirmar reset de senha');
    }
  }

  public async listUsers(): Promise<CognitoUserProfile[]> {
    try {
      const command = new ListUsersCommand({
        UserPoolId: this.userPoolId,
      });

      const response = await this.cognitoClient.send(command);

      if (!response.Users) {
        return [];
      }

      const users: CognitoUserProfile[] = [];

      for (const user of response.Users) {
        if (user.Username) {
          const userGroups = await this.getUserGroups(user.Username);

          const profile: CognitoUserProfile = {
            id: user.Username,
            email: '',
            emailVerified: false,
            groups: userGroups,
            attributes: {},
          };

          user.Attributes?.forEach(attr => {
            if (attr.Name && attr.Value) {
              switch (attr.Name) {
                case 'email':
                  profile.email = attr.Value;
                  break;
                case 'email_verified':
                  profile.emailVerified = attr.Value === 'true';
                  break;
                case 'name':
                  profile.name = attr.Value;
                  break;
                default:
                  if (profile.attributes) {
                    profile.attributes[attr.Name] = attr.Value;
                  }
              }
            }
          });

          users.push(profile);
        }
      }

      return users;
    } catch (error: any) {
      console.error('Erro ao listar usuários:', error);
      throw new HttpException(500, 'Erro ao listar usuários');
    }
  }

  public async deleteUser(username: string): Promise<void> {
    if (isEmpty(username)) {
      throw new HttpException(400, 'Username é obrigatório');
    }

    try {
      const command = new AdminDeleteUserCommand({
        UserPoolId: this.userPoolId,
        Username: username,
      });

      await this.cognitoClient.send(command);
    } catch (error: any) {
      console.error('Erro ao deletar usuário:', error);

      if (error.name === 'UserNotFoundException') {
        throw new HttpException(404, 'Usuário não encontrado');
      }

      throw new HttpException(500, 'Erro ao deletar usuário');
    }
  }

  private async getUserGroups(username: string): Promise<string[]> {
    try {
      const command = new AdminListGroupsForUserCommand({
        UserPoolId: this.userPoolId,
        Username: username,
      });

      const response = await this.cognitoClient.send(command);

      return response.Groups?.map(group => group.GroupName || '') || [];
    } catch (error) {
      console.error('Erro ao buscar grupos do usuário:', error);
      return [];
    }
  }

  private generateSecretHash(username: string): string {
    const crypto = require('crypto');
    const message = username + this.clientId;
    return crypto.createHmac('sha256', this.clientSecret).update(message).digest('base64');
  }

  public createCookie(tokenData: string): string {
    const expiresIn = Number(SESSION_EXPIRES);
    return `Authorization=${tokenData}; HttpOnly; Max-Age=${expiresIn};`;
  }
}

export default UsersCognitoService;
