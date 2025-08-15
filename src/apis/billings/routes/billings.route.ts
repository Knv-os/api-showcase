import { Router } from 'express';
import BillingsController from '@/apis/billings/controllers/billings.controller';
import { PaginationDto } from '@/helpers/pagination.helper';
import { CreateBillingDto } from '@/apis/billings/dtos/billings.dto';
import { Routes } from '@/apis/_general/interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { cognitoAuthMiddleware } from '@/apis/auth/middlewares/cognito.middleware';

class BillingsRoute implements Routes {
  public path = '/billings';
  public router = Router();
  public billingsController = new BillingsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, cognitoAuthMiddleware, validationMiddleware(PaginationDto, 'query', true), this.billingsController.getBillings);
    this.router.get(`${this.path}/:id`, cognitoAuthMiddleware, this.billingsController.getBillingById);
    this.router.post(`${this.path}`, cognitoAuthMiddleware, validationMiddleware(CreateBillingDto), this.billingsController.createBilling);
    this.router.put(`${this.path}/:id`, cognitoAuthMiddleware, validationMiddleware(CreateBillingDto, 'body', true), this.billingsController.updateBilling);
    this.router.delete(`${this.path}/:id`, cognitoAuthMiddleware, this.billingsController.deleteBilling);
    this.router.get(`${this.path}/files/list/:id`, cognitoAuthMiddleware, this.billingsController.filesList);
    this.router.delete(`${this.path}/files/delete/:id`, cognitoAuthMiddleware, this.billingsController.filesDelete);
  }
}

export default BillingsRoute;
