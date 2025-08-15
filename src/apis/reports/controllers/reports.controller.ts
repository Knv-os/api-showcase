import { NextFunction, Request, Response } from 'express';
import { PublicRequestDto } from '@apis/reports/dtos/reports.dto';
import { ReportCreateBody, ReportUpdateBody, PublicReport, Report } from '@apis/reports/interfaces/reports.interface';
import reportService from '@apis/reports/services/reports.service';
import { PaginationReqInterface, paginationResHelper, paginationSearchNormalize } from '@/helpers/pagination.helper';
import { RequestUpload } from '@/middlewares/upload.middleware';
import { FileOBject } from '@/utils/aws';

class ReportsController {
  public reportService = new reportService();
  private searchFields = ['idOmie', 'number', 'idOmieTaxAvaliation', 'descriptionClient', 'descriptionTech', 'client.name', 'status.name'];

  public getReports = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const paginationParams: PaginationReqInterface = paginationSearchNormalize(req.query, this.searchFields);
      const findAllReportsData: Report[] = await this.reportService.findAllReport(paginationParams);
      const countReports: number = await this.reportService.reportCount(paginationParams.where);

      const paginationResponse = paginationResHelper({
        all: countReports,
        page: paginationParams.page ? paginationParams.page : '1',
        perPage: paginationParams.perPage ? paginationParams.perPage : '20',
      });

      res.status(200).json({
        ...paginationResponse,
        data: findAllReportsData,
      });
    } catch (error) {
      next(error);
    }
  };

  public getReportById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reportId = req.params.id;
      const findOneReportData: Report = await this.reportService.findReportById(reportId);

      res.status(200).json(findOneReportData);
    } catch (error) {
      next(error);
    }
  };

  public createReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reportData: ReportCreateBody = req.body;
      const createReportData: Report = await this.reportService.createReport(reportData);

      res.status(201).json(createReportData);
    } catch (error) {
      next(error);
    }
  };

  public createPublicReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reportsPublicData: PublicRequestDto = req.body;
      const publicReport: PublicReport = await this.reportService.createPublicReport(reportsPublicData);

      res.status(201).json(publicReport);
    } catch (error) {
      next(error);
    }
  };

  public updateReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reportId = req.params.id;
      const reportData: ReportUpdateBody = req.body;
      const userId: string = req['authEntity'].id;
      const updateReportData: Report = await this.reportService.updateReport(reportId, reportData, userId);

      res.status(200).json(updateReportData);
    } catch (error) {
      next(error);
    }
  };

  public deleteReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reportId = req.params.id;
      await this.reportService.deleteReport(reportId);

      res.status(200).send('ok');
    } catch (error) {
      next(error);
    }
  };

  public uploadFile = async (req: RequestUpload, res: Response, next: NextFunction) => {
    try {
      const reportId = req.params.id;
      const reportFilesList: FileOBject[] = await this.reportService.reportUploadFile(reportId, req.file.originalname, req.file.buffer);

      res.status(200).json(reportFilesList);
    } catch (error) {
      next(error);
    }
  };

  public filesList = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reportId = req.params.id;
      const reportFilesList: FileOBject[] = await this.reportService.reportFilesList(reportId);

      res.status(200).json(reportFilesList);
    } catch (error) {
      next(error);
    }
  };

  public filesDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reportId = req.params.id;
      const fileName = `${req.query.fileName}`;
      const reportFilesList: FileOBject[] = await this.reportService.reportFilesDelete(reportId, fileName);

      res.status(200).json(reportFilesList);
    } catch (error) {
      next(error);
    }
  };

  public approve = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reportId = req.params.id;
      const userId: string = req['authEntity'].id;
      const reportResult: Report = await this.reportService.updateReport(
        reportId,
        {
          pending: false,
          denied: false,
        },
        userId,
      );

      res.status(200).json(reportResult);
    } catch (error) {
      next(error);
    }
  };

  public denied = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reportId = req.params.id;
      const userId: string = req['authEntity'].id;
      const reportResult: Report = await this.reportService.updateReport(
        reportId,
        {
          denied: true,
          pending: false,
        },
        userId,
      );

      res.status(200).json(reportResult);
    } catch (error) {
      next(error);
    }
  };
}

export default ReportsController;
