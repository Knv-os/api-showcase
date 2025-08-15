import { Router } from 'express';
import UsersController from '@/apis/users/controllers/users.controller';
import { PaginationDto } from '@/helpers/pagination.helper';
import { CreateUserDto } from '@/apis/users/dtos/users.dto';
import { Routes } from '@/apis/_general/interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { cognitoAuthMiddleware } from '@/apis/auth/middlewares/cognito.middleware';

class UsersRoute implements Routes {
  public path = '/users';
  public router = Router();
  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, cognitoAuthMiddleware, validationMiddleware(PaginationDto, 'query', true), this.usersController.getUsers);
    this.router.get(`${this.path}/:id`, cognitoAuthMiddleware, this.usersController.getUserById);
    this.router.post(`${this.path}`, cognitoAuthMiddleware, validationMiddleware(CreateUserDto), this.usersController.createUser);
    this.router.put(`${this.path}/:id`, cognitoAuthMiddleware, validationMiddleware(CreateUserDto, 'body', true), this.usersController.updateUser);
    this.router.delete(`${this.path}/:id`, cognitoAuthMiddleware, this.usersController.deleteUser);
  }
}

export default UsersRoute;
