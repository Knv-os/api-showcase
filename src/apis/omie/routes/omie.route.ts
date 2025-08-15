import { Router } from 'express';
import OmieController from '@/apis/omie/controllers/omie.controller';
import { Routes } from '@/apis/_general/interfaces/routes.interface';

class OmieRoute implements Routes {
  public path = '/omie';
  public router = Router();
  public omieController = new OmieController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/budgets`, this.omieController.getOmiebudgets);
    this.router.get(`${this.path}/budget/:idNumOmie`, this.omieController.getOmieBudget);
    this.router.post(`${this.path}/budgets/invoice`, this.omieController.getOmieInvoiceBudgets);
  }
}

export default OmieRoute;
