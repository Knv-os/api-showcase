import { Readable } from 'node:stream';
import { PublicRequestDto } from '@/apis/reports/dtos/reports.dto';
import { HttpException } from '@exceptions/HttpException';
import { ReportCreateBody, ReportUpdateBody, PublicReport, Report } from '@/apis/reports/interfaces/reports.interface';
import { isEmpty } from '@/utils/util';
import { ReportRepository } from '@/apis/reports/repositories/reports.repository';
import { PaginationReqInterface } from '@/helpers/pagination.helper';
import { FileOBject, S3Service } from '@/utils/aws';
import { reportsChangeString } from '../utils/reports.changeString';
import { HistoryRepository } from '@/apis/histories/repositories/histories.repository';
import { Client } from '@/apis/clients/interfaces/clients.interface';
import ClientService from '@/apis/clients/services/clients.service';
import CameraService from '@/apis/cameras/services/cameras.service';
import { Camera } from '@/apis/cameras/interfaces/cameras.interface';
import { STATUS_DEFAULT } from '@/config';

class ReportService {
  public reportRepository = new ReportRepository();
  public historyRepository = new HistoryRepository();
  public clientService = new ClientService();
  public cameraService = new CameraService();

  public async findAllReport(paginationParams: PaginationReqInterface): Promise<Report[]> {
    return this.reportRepository.findAll(paginationParams);
  }

  public async findReportById(reportId: string): Promise<Report> {
    if (isEmpty(reportId)) throw new HttpException(400, 'You not send reportId');

    const findReport: Report = await this.reportRepository.findById(reportId);
    if (!findReport) throw new HttpException(409, 'Not find report');

    return findReport;
  }

  public async createReport(reportData: ReportCreateBody): Promise<Report> {
    if (isEmpty(reportData)) throw new HttpException(400, 'You not send reportData');

    const createReportData: Report = await this.reportRepository.create(reportData);
    return createReportData;
  }

  public async createPublicReport(reportPublicData: PublicRequestDto): Promise<PublicReport> {
    if (isEmpty(reportPublicData)) throw new HttpException(400, 'You not send reportData');

    const client: Client = await this.clientService.createClientIfNotExists({
      company: reportPublicData.client.company,
      document: reportPublicData.client.document,
      email: reportPublicData.client.email,
      name: reportPublicData.client.name,
      phone: reportPublicData.client.phone,
    });

    const createReportsData: Report[] = [];

    for (const reportData of reportPublicData.reports) {
      const camera: Camera = await this.cameraService.findCameraById(reportData.serialNumber);

      const result: Report = await this.createReport({
        ...reportData,
        descriptionClient: reportData.descriptionClient,
        pending: true,
        denied: false,
        clientId: client.id,
        statusId: STATUS_DEFAULT,
        cameraId: camera ? camera.id : undefined,
      });
      createReportsData.push(result);
    }

    return {
      client,
      reports: createReportsData,
    };
  }

  public async updateReport(reportId: string, reportData: ReportUpdateBody, userId: string): Promise<Report> {
    if (isEmpty(reportData)) throw new HttpException(400, 'You not send reportData');

    const findReport: Report = await this.reportRepository.findById(reportId);
    if (!findReport) throw new HttpException(409, 'Not find report');

    await this.reportRepository.update(reportData, reportId);
    const updateReport: Report = await this.reportRepository.findById(reportId);
    this.createHistoriesUpdateReport(reportData, updateReport, findReport, userId);

    return updateReport;
  }

  public async createHistoriesUpdateReport(reportData: ReportUpdateBody, newReport: Report, oldReport: Report, userId: string) {
    if (oldReport) {
      const histories = [];
      for (const key in reportData) {
        if (JSON.stringify(reportData[key]) !== JSON.stringify(oldReport[key])) {
          const changeString = await reportsChangeString(key, oldReport, newReport);
          histories.push({
            reportId: oldReport.id,
            changeString,
            userId: userId,
          });
        }
      }
      if (histories.length > 0) {
        await this.historyRepository.createMany(histories);
      }
    }
  }

  public async deleteReport(reportId: string): Promise<Report> {
    if (isEmpty(reportId)) throw new HttpException(400, 'You not send reportId');

    const findReport: Report = await this.reportRepository.findById(reportId);
    if (!findReport) throw new HttpException(409, 'Not find report');

    await this.reportRepository.destroy(findReport.id);

    return findReport;
  }

  public async reportCount(where?: string): Promise<number> {
    return this.reportRepository.count(where ? { where: JSON.parse(where) } : undefined);
  }

  public async reportUploadFile(reportId: string, fileName: string, fileBuffer: Readable): Promise<FileOBject[]> {
    if (isEmpty(reportId)) throw new HttpException(400, 'You not send reportId');

    const findReport: Report = await this.reportRepository.findById(reportId);
    if (!findReport) throw new HttpException(409, 'Not find report');

    const s3Service = new S3Service();

    const awsUpload = s3Service.uploadEntityFiles('reports', reportId, fileName, fileBuffer);
    await awsUpload.done();

    return s3Service.listEntityFiles('reports', reportId);
  }

  public async reportFilesList(reportId: string): Promise<FileOBject[]> {
    if (isEmpty(reportId)) throw new HttpException(400, 'You not send reportId');

    const findReport: Report = await this.reportRepository.findById(reportId);
    if (!findReport) throw new HttpException(409, 'Not find report');

    return new S3Service().listEntityFiles('reports', reportId);
  }

  public async reportFilesDelete(reportId: string, fileName: string): Promise<FileOBject[]> {
    if (isEmpty(reportId)) throw new HttpException(400, 'You not send reportId');

    const findReport: Report = await this.reportRepository.findById(reportId);
    if (!findReport) throw new HttpException(409, 'Not find report');

    const s3Service = new S3Service();
    await s3Service.deleteFile(fileName);

    return s3Service.listEntityFiles('reports', reportId);
  }
}

export default ReportService;
