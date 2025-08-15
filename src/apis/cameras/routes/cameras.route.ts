import { Router } from 'express';
import CamerasController from '@/apis/cameras/controllers/cameras.controller';
import { PaginationDto } from '@/helpers/pagination.helper';
import { CreateCameraDto } from '@/apis/cameras/dtos/cameras.dto';
import { Routes } from '@/apis/_general/interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { cognitoAuthMiddleware } from '@/apis/auth/middlewares/cognito.middleware';

class CamerasRoute implements Routes {
  public path = '/cameras';
  public router = Router();
  public camerasController = new CamerasController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, cognitoAuthMiddleware, validationMiddleware(PaginationDto, 'query', true), this.camerasController.getCameras);
    this.router.get(`${this.path}/:id`, cognitoAuthMiddleware, this.camerasController.getCameraById);
    this.router.post(`${this.path}`, cognitoAuthMiddleware, validationMiddleware(CreateCameraDto), this.camerasController.createCamera);
    this.router.put(`${this.path}/:id`, cognitoAuthMiddleware, validationMiddleware(CreateCameraDto, 'body', true), this.camerasController.updateCamera);
    this.router.delete(`${this.path}/:id`, cognitoAuthMiddleware, this.camerasController.deleteCamera);
    this.router.get(`${this.path}/files/list/:id`, cognitoAuthMiddleware, this.camerasController.filesList);
    this.router.delete(`${this.path}/files/delete/:id`, cognitoAuthMiddleware, this.camerasController.filesDelete);

    this.router.get(`${this.path}/validate/warranty/:serialNumber`, this.camerasController.validateWarranty);
  }
}

export default CamerasRoute;
