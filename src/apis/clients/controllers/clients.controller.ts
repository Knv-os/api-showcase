import { NextFunction, Request, Response } from 'express';
import { Client, ClientCreateBody, ClientUpdateBody } from '@/apis/clients/interfaces/clients.interface';
import clientService from '@/apis/clients/services/clients.service';
import { PaginationReqInterface, paginationResHelper, paginationSearchNormalize } from '@/helpers/pagination.helper';
import { RequestUpload } from '@/middlewares/upload.middleware';
import { FileOBject } from '@/utils/aws';

class ClientsController {
  public clientService = new clientService();
  private searchFields = ['name', 'email', 'document', 'phone', 'company', 'description'];

  public getClients = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const paginationParams: PaginationReqInterface = paginationSearchNormalize(req.query, this.searchFields);
      const findAllClientsData: Client[] = await this.clientService.findAllClient(paginationParams);
      const countClients: number = await this.clientService.clientCount(paginationParams.where);

      const paginationResponse = paginationResHelper({
        all: countClients,
        page: paginationParams.page ? paginationParams.page : '1',
        perPage: paginationParams.perPage ? paginationParams.perPage : '20',
      });

      res.status(200).json({
        ...paginationResponse,
        data: findAllClientsData,
      });
    } catch (error) {
      next(error);
    }
  };

  public getClientById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const clientId = req.params.id;
      const findOneClientData: Client = await this.clientService.findClientById(clientId);

      res.status(200).json(findOneClientData);
    } catch (error) {
      next(error);
    }
  };

  public createClient = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const clientData: ClientCreateBody = req.body;
      const createClientData: Client = await this.clientService.createClient(clientData);

      res.status(201).json(createClientData);
    } catch (error) {
      next(error);
    }
  };

  public updateClient = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const clientId = req.params.id;
      const clientData: ClientUpdateBody = req.body;
      const updateClientData: Client = await this.clientService.updateClient(clientId, clientData);

      res.status(200).json(updateClientData);
    } catch (error) {
      next(error);
    }
  };

  public deleteClient = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const clientId = req.params.id;
      await this.clientService.deleteClient(clientId);

      res.status(200).send('ok');
    } catch (error) {
      next(error);
    }
  };

  public uploadFile = async (req: RequestUpload, res: Response, next: NextFunction) => {
    try {
      const clientId = req.params.id;
      const clientFilesList: FileOBject[] = await this.clientService.clientUploadFile(clientId, req.file.originalname, req.file.buffer);

      res.status(200).json(clientFilesList);
    } catch (error) {
      next(error);
    }
  };

  public filesList = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const clientId = req.params.id;
      const clientFilesList: FileOBject[] = await this.clientService.clientFilesList(clientId);

      res.status(200).json(clientFilesList);
    } catch (error) {
      next(error);
    }
  };

  public filesDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const clientId = req.params.id;
      const fileName = `${req.query.fileName}`;
      const clientFilesList: FileOBject[] = await this.clientService.clientFilesDelete(clientId, fileName);

      res.status(200).json(clientFilesList);
    } catch (error) {
      next(error);
    }
  };
}

export default ClientsController;
