import { NextFunction, Request, Response } from 'express';
import omieService from '@apis/omie/services/omie.service';
import { OmieBudgetsApiResponse } from '@apis/omie/interfaces/omie.interface';

class OmieController {
  public omieService = new omieService();

  public getOmiebudgets = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const omieBudgets: OmieBudgetsApiResponse[] = await this.omieService.getBudgets();

      res.status(200).json(omieBudgets);
    } catch (error) {
      next(error);
    }
  };

  public getOmieBudget = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const idNumOmie = req.params.idNumOmie;
      const omieOrder = await this.omieService.getBudget(idNumOmie);

      res.status(200).json(omieOrder);
    } catch (error) {
      next(error);
    }
  };

  public getOmieInvoiceBudgets = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dataFaturamentoInit = req.body.dataFaturamentoInit;
      const dataFaturamentoFim = req.body.dataFaturamentoFim;
      const omieOrders = await this.omieService.getBudgetsInvoice(dataFaturamentoInit, dataFaturamentoFim);

      res.status(200).json(omieOrders);
    } catch (error) {
      next(error);
    }
  };
}

export default OmieController;
