import { Router } from 'express';
import { PaginationDto } from '@/helpers/pagination.helper';
import { Routes } from '@/apis/_general/interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { cognitoAuthMiddleware } from '@/apis/auth/middlewares/cognito.middleware';
import OrdersController from '../controllers/orders.controller';
import { CreateOrderDto } from '../dtos/orders.dto';

class OrdersRoutes implements Routes {
  public path = '/orders';
  public router = Router();
  public ordersController = new OrdersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, cognitoAuthMiddleware, validationMiddleware(PaginationDto, 'query', true), this.ordersController.getOrders);
    this.router.get(`${this.path}/:id`, cognitoAuthMiddleware, this.ordersController.getOrderById);
    this.router.post(`${this.path}`, cognitoAuthMiddleware, validationMiddleware(CreateOrderDto), this.ordersController.createOrder);
    this.router.put(`${this.path}/:id`, cognitoAuthMiddleware, validationMiddleware(CreateOrderDto, 'body', true), this.ordersController.updateOrder);
    this.router.delete(`${this.path}/:id`, cognitoAuthMiddleware, this.ordersController.deleteOrder);
  }
}

export default OrdersRoutes;
