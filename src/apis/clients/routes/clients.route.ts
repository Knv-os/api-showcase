import { Router } from 'express';
import ClientsController from '@/apis/clients/controllers/clients.controller';
import { PaginationDto } from '@/helpers/pagination.helper';
import { CreateClientDto } from '@/apis/clients/dtos/clients.dto';
import { Routes } from '@/apis/_general/interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { cognitoAuthMiddleware } from '@/apis/auth/middlewares/cognito.middleware';
import uploadMiddleware from '@/middlewares/upload.middleware';

class ClientsRoute implements Routes {
  public path = '/clients';
  public router = Router();
  public clientsController = new ClientsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, cognitoAuthMiddleware, validationMiddleware(PaginationDto, 'query', true), this.clientsController.getClients);
    this.router.get(`${this.path}/:id`, cognitoAuthMiddleware, this.clientsController.getClientById);
    this.router.post(`${this.path}`, cognitoAuthMiddleware, validationMiddleware(CreateClientDto), this.clientsController.createClient);
    this.router.put(`${this.path}/:id`, cognitoAuthMiddleware, validationMiddleware(CreateClientDto, 'body', true), this.clientsController.updateClient);
    this.router.delete(`${this.path}/:id`, cognitoAuthMiddleware, this.clientsController.deleteClient);
    this.router.post(`${this.path}/files/upload/:id`, cognitoAuthMiddleware, uploadMiddleware.single('file'), this.clientsController.uploadFile);
    this.router.get(`${this.path}/files/list/:id`, cognitoAuthMiddleware, this.clientsController.filesList);
    this.router.delete(`${this.path}/files/delete/:id`, cognitoAuthMiddleware, this.clientsController.filesDelete);
  }
}

export default ClientsRoute;
