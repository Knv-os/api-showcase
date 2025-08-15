import { Router } from 'express';
import { PaginationDto } from '@/helpers/pagination.helper';
import { Routes } from '@/apis/_general/interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { cognitoAuthMiddleware } from '@/apis/auth/middlewares/cognito.middleware';
import ServicesController from '../controllers/services.controller';
import { CreateServiceDto } from '../dtos/services.dto';

class ServicesRoutes implements Routes {
  public path = '/services';
  public router = Router();
  public servicesController = new ServicesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, cognitoAuthMiddleware, validationMiddleware(PaginationDto, 'query', true), this.servicesController.getServices);
    this.router.get(`${this.path}/:id`, cognitoAuthMiddleware, this.servicesController.getServiceById);
    this.router.post(`${this.path}`, cognitoAuthMiddleware, validationMiddleware(CreateServiceDto), this.servicesController.createService);
    this.router.put(`${this.path}/:id`, cognitoAuthMiddleware, validationMiddleware(CreateServiceDto, 'body', true), this.servicesController.updateService);
    this.router.delete(`${this.path}/:id`, cognitoAuthMiddleware, this.servicesController.deleteService);
  }
}

export default ServicesRoutes;
