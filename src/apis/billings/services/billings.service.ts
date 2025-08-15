import { Readable } from 'node:stream';
import { HttpException } from '@exceptions/HttpException';
import { Billing, BillingCreateBody, BillingUpdateBody } from '@/apis/billings/interfaces/billings.interface';
import { isEmpty } from '@/utils/util';
import { BillingRepository } from '@/apis/billings/repositories/billings.repository';
import { PaginationReqInterface } from '@/helpers/pagination.helper';
import { FileOBject, S3Service } from '@/utils/aws';

class BillingService {
  public billingRepository = new BillingRepository();

  public async findAllBilling(paginationParams: PaginationReqInterface): Promise<Billing[]> {
    return this.billingRepository.findAll(paginationParams);
  }

  public async findBillingById(billingId: string): Promise<Billing> {
    if (isEmpty(billingId)) throw new HttpException(400, 'You not send billingId');

    const findBilling: Billing = await this.billingRepository.findById(billingId);
    if (!findBilling) throw new HttpException(409, 'Not find billing');

    return findBilling;
  }

  public async createBilling(billingData: BillingCreateBody): Promise<Billing> {
    if (isEmpty(billingData)) throw new HttpException(400, 'You not send billingData');

    const findBilling: Billing = await this.billingRepository.findOne({ document: billingData.document });
    if (findBilling) throw new HttpException(409, `This billing document ${billingData.document} already exists`);

    const createBillingData: Billing = await this.billingRepository.create(billingData);
    return createBillingData;
  }

  public async updateBilling(billingId: string, billingData: BillingUpdateBody): Promise<Billing> {
    if (isEmpty(billingData)) throw new HttpException(400, 'You not send billingData');

    const findBilling: Billing = await this.billingRepository.findById(billingId);
    if (!findBilling) throw new HttpException(409, 'Not find billing');

    await this.billingRepository.update(billingData, billingId);

    const updateBilling: Billing = await this.billingRepository.findById(billingId);
    return updateBilling;
  }

  public async deleteBilling(billingId: string): Promise<Billing> {
    if (isEmpty(billingId)) throw new HttpException(400, 'You not send billingId');

    const findBilling: Billing = await this.billingRepository.findById(billingId);
    if (!findBilling) throw new HttpException(409, 'Not find billing');

    await this.billingRepository.destroy(findBilling.id);

    return findBilling;
  }

  public async billingCount(where?: string): Promise<number> {
    return this.billingRepository.count(where ? { where: JSON.parse(where) } : undefined);
  }

  public async billingUploadFile(billingId: string, fileName: string, fileBuffer: Readable): Promise<FileOBject[]> {
    if (isEmpty(billingId)) throw new HttpException(400, 'You not send billingId');

    const findBilling: Billing = await this.billingRepository.findById(billingId);
    if (!findBilling) throw new HttpException(409, 'Not find billing');

    const s3Service = new S3Service();

    const awsUpload = s3Service.uploadEntityFiles('billings', billingId, fileName, fileBuffer);
    await awsUpload.done();

    return s3Service.listEntityFiles('billings', billingId);
  }

  public async billingFilesList(billingId: string): Promise<FileOBject[]> {
    if (isEmpty(billingId)) throw new HttpException(400, 'You not send billingId');

    const findBilling: Billing = await this.billingRepository.findById(billingId);
    if (!findBilling) throw new HttpException(409, 'Not find billing');

    return new S3Service().listEntityFiles('billings', billingId);
  }

  public async billingFilesDelete(billingId: string, fileName: string): Promise<FileOBject[]> {
    if (isEmpty(billingId)) throw new HttpException(400, 'You not send billingId');

    const findBilling: Billing = await this.billingRepository.findById(billingId);
    if (!findBilling) throw new HttpException(409, 'Not find billing');

    const s3Service = new S3Service();
    await s3Service.deleteFile(fileName);

    return s3Service.listEntityFiles('billings', billingId);
  }
}

export default BillingService;
