import { NextFunction, Request, Response } from 'express';
import { Status, StatusCreateBody, StatusUpdateBody } from '@/apis/status/interfaces/status.interface';
import statusService from '@/apis/status/services/status.service';
import { PaginationReqInterface, paginationResHelper, paginationSearchNormalize } from '@/helpers/pagination.helper';

class StatusController {
  public statusService = new statusService();
  private searchFields = ['backgroundColor', 'name', 'textColor'];

  public getStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const paginationParams: PaginationReqInterface = paginationSearchNormalize(req.query, this.searchFields);
      const findAllStatusData: Status[] = await this.statusService.findAllStatus(paginationParams);
      const countStatus: number = await this.statusService.statusCount(paginationParams.where);

      const paginationResponse = paginationResHelper({
        all: countStatus,
        page: paginationParams.page ? paginationParams.page : '1',
        perPage: paginationParams.perPage ? paginationParams.perPage : '20',
      });

      res.status(200).json({
        ...paginationResponse,
        data: findAllStatusData,
      });
    } catch (error) {
      next(error);
    }
  };

  public getStatusById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const statusId = req.params.id;
      const findOneStatusData: Status = await this.statusService.findStatusById(statusId);

      res.status(200).json(findOneStatusData);
    } catch (error) {
      next(error);
    }
  };

  public createStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const statusData: StatusCreateBody = req.body;
      const createStatusData: Status = await this.statusService.createStatus(statusData);

      res.status(201).json(createStatusData);
    } catch (error) {
      next(error);
    }
  };

  public updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const statusId = req.params.id;
      const statusData: StatusUpdateBody = req.body;
      const updateStatusData: Status = await this.statusService.updateStatus(statusId, statusData);

      res.status(200).json(updateStatusData);
    } catch (error) {
      next(error);
    }
  };

  public deleteStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const statusId = req.params.id;
      await this.statusService.deleteStatus(statusId);

      res.status(200).send('ok');
    } catch (error) {
      next(error);
    }
  };
}

export default StatusController;
