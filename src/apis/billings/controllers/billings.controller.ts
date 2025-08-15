import { NextFunction, Request, Response } from 'express';
import { Billing, BillingCreateBody, BillingUpdateBody } from '@/apis/billings/interfaces/billings.interface';
import billingService from '@/apis/billings/services/billings.service';
import { PaginationReqInterface, paginationResHelper, paginationSearchNormalize } from '@/helpers/pagination.helper';
import { RequestUpload } from '@/middlewares/upload.middleware';
import { FileOBject } from '@/utils/aws';

class BillingsController {
  public billingService = new billingService();
  private searchFields = ['companyName', 'document', 'fantasyName', 'phone', 'street', 'neighborhood', 'number', 'unit', 'state', 'city', 'zipCode'];

  public getBillings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const paginationParams: PaginationReqInterface = paginationSearchNormalize(req.query, this.searchFields);
      const findAllBillingsData: Billing[] = await this.billingService.findAllBilling(paginationParams);
      const countBillings: number = await this.billingService.billingCount(paginationParams.where);

      const paginationResponse = paginationResHelper({
        all: countBillings,
        page: paginationParams.page ? paginationParams.page : '1',
        perPage: paginationParams.perPage ? paginationParams.perPage : '20',
      });

      res.status(200).json({
        ...paginationResponse,
        data: findAllBillingsData,
      });
    } catch (error) {
      next(error);
    }
  };

  public getBillingById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const billingId = req.params.id;
      const findOneBillingData: Billing = await this.billingService.findBillingById(billingId);

      res.status(200).json(findOneBillingData);
    } catch (error) {
      next(error);
    }
  };

  public createBilling = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const billingData: BillingCreateBody = req.body;
      const createBillingData: Billing = await this.billingService.createBilling(billingData);

      res.status(201).json(createBillingData);
    } catch (error) {
      next(error);
    }
  };

  public updateBilling = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const billingId = req.params.id;
      const billingData: BillingUpdateBody = req.body;
      const updateBillingData: Billing = await this.billingService.updateBilling(billingId, billingData);

      res.status(200).json(updateBillingData);
    } catch (error) {
      next(error);
    }
  };

  public deleteBilling = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const billingId = req.params.id;
      await this.billingService.deleteBilling(billingId);

      res.status(200).send('ok');
    } catch (error) {
      next(error);
    }
  };

  public uploadFile = async (req: RequestUpload, res: Response, next: NextFunction) => {
    try {
      const billingId = req.params.id;
      const billingFilesList: FileOBject[] = await this.billingService.billingUploadFile(billingId, req.file.originalname, req.file.buffer);

      res.status(200).json(billingFilesList);
    } catch (error) {
      next(error);
    }
  };

  public filesList = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const billingId = req.params.id;
      const billingFilesList: FileOBject[] = await this.billingService.billingFilesList(billingId);

      res.status(200).json(billingFilesList);
    } catch (error) {
      next(error);
    }
  };

  public filesDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const billingId = req.params.id;
      const fileName = `${req.query.fileName}`;
      const billingFilesList: FileOBject[] = await this.billingService.billingFilesDelete(billingId, fileName);

      res.status(200).json(billingFilesList);
    } catch (error) {
      next(error);
    }
  };
}

export default BillingsController;
