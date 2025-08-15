import { NextFunction, Request, Response } from 'express';
import { User, UserCreateBody, UserUpdateBody } from '@/apis/users/interfaces/users.interface';
import userService from '@/apis/users/services/users.service';
import { PaginationReqInterface, paginationResHelper, paginationSearchNormalize } from '@/helpers/pagination.helper';

class UsersController {
  public userService = new userService();
  private searchFields = ['email', 'name'];

  public getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const paginationParams: PaginationReqInterface = paginationSearchNormalize(req.query, this.searchFields);
      const findAllUsersData: User[] = await this.userService.findAllUser(paginationParams);
      const countUsers: number = await this.userService.userCount(paginationParams.where);

      const paginationResponse = paginationResHelper({
        all: countUsers,
        page: paginationParams.page ? paginationParams.page : '1',
        perPage: paginationParams.perPage ? paginationParams.perPage : '20',
      });

      res.status(200).json({
        ...paginationResponse,
        data: findAllUsersData,
      });
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.id;
      const findOneUserData: User = await this.userService.findUserById(userId);

      res.status(200).json(findOneUserData);
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: UserCreateBody = req.body;
      const createUserData: User = await this.userService.createUser(userData);

      res.status(201).json(createUserData);
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.id;
      const userData: UserUpdateBody = req.body;
      const updateUserData: User = await this.userService.updateUser(userId, userData);

      res.status(200).json(updateUserData);
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.id;
      await this.userService.deleteUser(userId);

      res.status(200).send('ok');
    } catch (error) {
      next(error);
    }
  };
}

export default UsersController;
