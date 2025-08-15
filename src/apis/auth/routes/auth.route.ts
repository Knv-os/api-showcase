import { Router } from 'express';
import UsersCognitoController from '@/apis/users_cognito/controllers/users_cognito.controller';
import { AuthLoginDto } from '@apis/auth/dtos/auth.dto';
import { Routes } from '@/apis/_general/interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';

class AuthRoute implements Routes {
  public path = '/';
  public router = Router();
  public usersCognitoController = new UsersCognitoController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}login`, validationMiddleware(AuthLoginDto, 'body'), this.usersCognitoController.login);
  }
}

export default AuthRoute;
