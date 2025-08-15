import { NextFunction, Request, Response } from 'express';
import {
  CognitoLoginDto,
  CognitoChangePasswordDto,
  CognitoForgotPasswordDto,
  CognitoConfirmForgotPasswordDto,
  CognitoCreateUserDto
} from '@apis/users_cognito/dtos/users_cognito.dto';
import { RequestWithCognitoUser } from '@apis/users_cognito/interfaces/users_cognito.interface';
import UsersCognitoService from '@apis/users_cognito/services/users_cognito.service';

class UsersCognitoController {
  public usersCognitoService = new UsersCognitoService();

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CognitoLoginDto = req.body;
      const authResult = await this.usersCognitoService.authenticateUser(userData.email, userData.password);

      res.setHeader('Set-Cookie', [authResult.cookie]);
      res.status(200).json({
        data: {
          user: {
            id: authResult.user.id,
            email: authResult.user.email,
            name: authResult.user.name,
            emailVerified: authResult.user.emailVerified,
            groups: authResult.user.groups || []
          },
          accessToken: authResult.accessToken,
          refreshToken: authResult.refreshToken,
          idToken: authResult.idToken
        },
        message: 'Login realizado com sucesso'
      });
    } catch (error) {
      next(error);
    }
  };

  public getProfile = async (req: RequestWithCognitoUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userProfile = await this.usersCognitoService.getUserProfile(req.cognitoUser.sub);

      res.status(200).json({
        data: userProfile,
        message: 'Perfil do usuário recuperado com sucesso'
      });
    } catch (error) {
      next(error);
    }
  };

  public changePassword = async (req: RequestWithCognitoUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const passwordData: CognitoChangePasswordDto = req.body;
      const accessToken = req.header('Authorization')?.split('Bearer ')[1];

      if (!accessToken) {
        res.status(401).json({ message: 'Token de acesso não fornecido' });
      }

      await this.usersCognitoService.changePassword(
        accessToken,
        passwordData.oldPassword,
        passwordData.newPassword
      );

      res.status(200).json({
        message: 'Senha alterada com sucesso'
      });
    } catch (error) {
      next(error);
    }
  };

  public forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const forgotPasswordData: CognitoForgotPasswordDto = req.body;

      await this.usersCognitoService.forgotPassword(forgotPasswordData.email);

      res.status(200).json({
        message: 'Código de recuperação enviado por email'
      });
    } catch (error) {
      next(error);
    }
  };

  public confirmForgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const confirmData: CognitoConfirmForgotPasswordDto = req.body;

      await this.usersCognitoService.confirmForgotPassword(
        confirmData.email,
        confirmData.confirmationCode,
        confirmData.newPassword
      );

      res.status(200).json({
        message: 'Senha redefinida com sucesso'
      });
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: RequestWithCognitoUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CognitoCreateUserDto = req.body;

      const newUser = await this.usersCognitoService.createUser(
        userData.email,
        userData.name,
        userData.password,
        userData.groupName
      );

      res.status(201).json({
        data: newUser,
        message: 'Usuário criado com sucesso'
      });
    } catch (error) {
      next(error);
    }
  };

  public getUsers = async (req: RequestWithCognitoUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await this.usersCognitoService.listUsers();

      res.status(200).json({
        data: users,
        message: 'Usuários recuperados com sucesso'
      });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: RequestWithCognitoUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId } = req.params;

      await this.usersCognitoService.deleteUser(userId);

      res.status(200).json({
        message: 'Usuário deletado com sucesso'
      });
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: RequestWithCognitoUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId } = req.params;

      const user = await this.usersCognitoService.getUserProfile(userId);

      res.status(200).json({
        data: user,
        message: 'Usuário encontrado com sucesso'
      });
    } catch (error) {
      next(error);
    }
  };
}

export default UsersCognitoController;
