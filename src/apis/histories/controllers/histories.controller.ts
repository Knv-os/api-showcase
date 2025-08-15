import { NextFunction, Request, Response } from 'express';
import { History, HistoryCreateBody, HistoryUpdateBody } from '@/apis/histories/interfaces/histories.interface';
import historyService from '@/apis/histories/services/histories.service';
import { PaginationReqInterface, paginationResHelper, paginationSearchNormalize } from '@/helpers/pagination.helper';

class HistoriesController {
  public historyService = new historyService();
  private searchFields = ['changeString'];

  public getHistories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const paginationParams: PaginationReqInterface = paginationSearchNormalize(req.query, this.searchFields);
      const findAllHistoriesData: History[] = await this.historyService.findAllHistory(paginationParams);
      const countHistories: number = await this.historyService.historyCount(paginationParams.where);

      const paginationResponse = paginationResHelper({
        all: countHistories,
        page: paginationParams.page ? paginationParams.page : '1',
        perPage: paginationParams.perPage ? paginationParams.perPage : '20',
      });

      res.status(200).json({
        ...paginationResponse,
        data: findAllHistoriesData,
      });
    } catch (error) {
      next(error);
    }
  };

  public getHistoryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const historyId = req.params.id;
      const findOneHistoryData: History = await this.historyService.findHistoryById(historyId);

      res.status(200).json(findOneHistoryData);
    } catch (error) {
      next(error);
    }
  };

  public createHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const historyData: HistoryCreateBody = req.body;
      const createHistoryData: History = await this.historyService.createHistory(historyData);

      res.status(201).json(createHistoryData);
    } catch (error) {
      next(error);
    }
  };

  public updateHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const historyId = req.params.id;
      const historyData: HistoryUpdateBody = req.body;
      const updateHistoryData: History = await this.historyService.updateHistory(historyId, historyData);

      res.status(200).json(updateHistoryData);
    } catch (error) {
      next(error);
    }
  };

  public deleteHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const historyId = req.params.id;
      await this.historyService.deleteHistory(historyId);

      res.status(200).send('ok');
    } catch (error) {
      next(error);
    }
  };
}

export default HistoriesController;
