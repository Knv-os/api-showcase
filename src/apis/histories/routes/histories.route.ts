import { Router } from 'express';
import HistoriesController from '@/apis/histories/controllers/histories.controller';
import { PaginationDto } from '@/helpers/pagination.helper';
import { CreateHistoryDto } from '@/apis/histories/dtos/histories.dto';
import { Routes } from '@/apis/_general/interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { cognitoAuthMiddleware } from '@/apis/auth/middlewares/cognito.middleware';

class HistoriesRoute implements Routes {
  public path = '/histories';
  public router = Router();
  public historiesController = new HistoriesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, cognitoAuthMiddleware, validationMiddleware(PaginationDto, 'query', true), this.historiesController.getHistories);
    this.router.get(`${this.path}/:id`, cognitoAuthMiddleware, this.historiesController.getHistoryById);
    this.router.post(`${this.path}`, cognitoAuthMiddleware, validationMiddleware(CreateHistoryDto), this.historiesController.createHistory);
    this.router.put(
      `${this.path}/:id`,
      cognitoAuthMiddleware,
      validationMiddleware(CreateHistoryDto, 'body', true),
      this.historiesController.updateHistory,
    );
    this.router.delete(`${this.path}/:id`, cognitoAuthMiddleware, this.historiesController.deleteHistory);
  }
}

export default HistoriesRoute;
