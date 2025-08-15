import { NextFunction, Request, Response } from 'express';
import { PaginationReqInterface, paginationResHelper, paginationSearchNormalize } from '@/helpers/pagination.helper';
import ServicesService from '../services/services.service';
import { Service, ServiceCreateBody, ServiceUpdateBody } from '../interfaces/services.interface';

class ServicesController {
  public serviceService = new ServicesService();
  private searchFields = ['idOmie', 'name', 'pricing', 'pricingPartner'];

  public getServices = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const paginationParams: PaginationReqInterface = paginationSearchNormalize(req.query, this.searchFields);
      const findAllServicesData: Service[] = await this.serviceService.findAllServices(paginationParams);
      const countServices: number = await this.serviceService.serviceCount(paginationParams.where);

      const paginationResponse = paginationResHelper({
        all: countServices,
        page: paginationParams.page ? paginationParams.page : '1',
        perPage: paginationParams.perPage ? paginationParams.perPage : '20',
      });

      res.status(200).json({
        ...paginationResponse,
        data: findAllServicesData,
      });
    } catch (error) {
      next(error);
    }
  };

  public getServiceById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const serviceId = req.params.id;
      const findOneServiceData: Service = await this.serviceService.findServiceById(serviceId);

      res.status(200).json(findOneServiceData);
    } catch (error) {
      next(error);
    }
  };

  public createService = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const serviceData: ServiceCreateBody = req.body;
      const createServiceData: Service = await this.serviceService.createService(serviceData);

      res.status(201).json(createServiceData);
    } catch (error) {
      next(error);
    }
  };

  public updateService = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const serviceId = req.params.id;
      const serviceData: ServiceUpdateBody = req.body;
      const updateService: Service = await this.serviceService.updateService(serviceId, serviceData);

      res.status(200).json(updateService);
    } catch (error) {
      next(error);
    }
  };

  public deleteService = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const serviceid = req.params.id;
      await this.serviceService.deleteService(serviceid);

      res.status(200).send('ok');
    } catch (error) {
      next(error);
    }
  };
}

export default ServicesController;
