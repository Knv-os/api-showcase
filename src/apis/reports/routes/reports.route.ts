import { Router } from 'express';
import ReportsController from '@/apis/reports/controllers/reports.controller';
import { PaginationDto } from '@/helpers/pagination.helper';
import { CreateReportDto } from '@/apis/reports/dtos/reports.dto';
import { Routes } from '@/apis/_general/interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { cognitoAuthMiddleware } from '@/apis/auth/middlewares/cognito.middleware';
import uploadMiddleware from '@/middlewares/upload.middleware';

class ReportsRoute implements Routes {
  public path = '/reports';
  public router = Router();
  public reportsController = new ReportsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, cognitoAuthMiddleware, validationMiddleware(PaginationDto, 'query', true), this.reportsController.getReports);
    this.router.get(`${this.path}/:id`, cognitoAuthMiddleware, this.reportsController.getReportById);
    this.router.post(`${this.path}`, cognitoAuthMiddleware, validationMiddleware(CreateReportDto), this.reportsController.createReport);
    this.router.put(`${this.path}/:id`, cognitoAuthMiddleware, validationMiddleware(CreateReportDto, 'body', true), this.reportsController.updateReport);
    this.router.delete(`${this.path}/:id`, cognitoAuthMiddleware, this.reportsController.deleteReport);
    this.router.post(`${this.path}/files/upload/:id`, cognitoAuthMiddleware, uploadMiddleware.single('file'), this.reportsController.uploadFile);
    this.router.get(`${this.path}/files/list/:id`, cognitoAuthMiddleware, this.reportsController.filesList);
    this.router.delete(`${this.path}/files/delete/:id`, cognitoAuthMiddleware, this.reportsController.filesDelete);
    this.router.post(`${this.path}/public/create/`, this.reportsController.createPublicReport);

    this.router.put(`${this.path}/approve/:id`, cognitoAuthMiddleware, this.reportsController.approve);
    this.router.put(`${this.path}/denied/:id`, cognitoAuthMiddleware, this.reportsController.denied);
  }
}

export default ReportsRoute;
