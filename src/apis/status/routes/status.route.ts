import { Router } from 'express';
import StatusController from '@/apis/status/controllers/status.controller';
import { PaginationDto } from '@/helpers/pagination.helper';
import { CreateStatusDto } from '@/apis/status/dtos/status.dto';
import { Routes } from '@/apis/_general/interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { cognitoAuthMiddleware } from '@/apis/auth/middlewares/cognito.middleware';

class StatusRoute implements Routes {
  public path = '/status';
  public router = Router();
  public statusController = new StatusController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, cognitoAuthMiddleware, validationMiddleware(PaginationDto, 'query', true), this.statusController.getStatus);
    this.router.get(`${this.path}/:id`, cognitoAuthMiddleware, this.statusController.getStatusById);
    this.router.post(`${this.path}`, cognitoAuthMiddleware, validationMiddleware(CreateStatusDto), this.statusController.createStatus);
    this.router.put(`${this.path}/:id`, cognitoAuthMiddleware, validationMiddleware(CreateStatusDto, 'body', true), this.statusController.updateStatus);
    this.router.delete(`${this.path}/:id`, cognitoAuthMiddleware, this.statusController.deleteStatus);
  }
}

export default StatusRoute;
