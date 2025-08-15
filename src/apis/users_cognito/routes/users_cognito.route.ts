import { Router } from 'express';
import UsersCognitoController from '@apis/users_cognito/controllers/users_cognito.controller';
import { Routes } from '@apis/_general/interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { cognitoAuthMiddleware } from '@apis/auth/middlewares/cognito.middleware';
import { 
  CognitoLoginDto, 
  CognitoChangePasswordDto, 
  CognitoForgotPasswordDto, 
  CognitoConfirmForgotPasswordDto,
  CognitoCreateUserDto 
} from '@apis/users_cognito/dtos/users_cognito.dto';

class UsersCognitoRoute implements Routes {
  public path = '/users-cognito';
  public router = Router();
  public usersCognitoController = new UsersCognitoController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Rotas públicas (sem autenticação)
    this.router.post(
      `${this.path}/login`, 
      validationMiddleware(CognitoLoginDto, 'body'), 
      this.usersCognitoController.login
    );

    this.router.post(
      `${this.path}/forgot-password`, 
      validationMiddleware(CognitoForgotPasswordDto, 'body'), 
      this.usersCognitoController.forgotPassword
    );

    this.router.post(
      `${this.path}/confirm-forgot-password`, 
      validationMiddleware(CognitoConfirmForgotPasswordDto, 'body'), 
      this.usersCognitoController.confirmForgotPassword
    );

    // Rotas protegidas (com autenticação Cognito)
    this.router.get(
      `${this.path}/profile`, 
      cognitoAuthMiddleware, 
      this.usersCognitoController.getProfile
    );

    this.router.put(
      `${this.path}/change-password`, 
      cognitoAuthMiddleware,
      validationMiddleware(CognitoChangePasswordDto, 'body'), 
      this.usersCognitoController.changePassword
    );

    this.router.get(
      `${this.path}/users`, 
      cognitoAuthMiddleware, 
      this.usersCognitoController.getUsers
    );

    this.router.get(
      `${this.path}/users/:userId`, 
      cognitoAuthMiddleware, 
      this.usersCognitoController.getUserById
    );

    this.router.post(
      `${this.path}/users`, 
      cognitoAuthMiddleware,
      validationMiddleware(CognitoCreateUserDto, 'body'), 
      this.usersCognitoController.createUser
    );

    this.router.delete(
      `${this.path}/users/:userId`, 
      cognitoAuthMiddleware, 
      this.usersCognitoController.deleteUser
    );
  }
}

export default UsersCognitoRoute;