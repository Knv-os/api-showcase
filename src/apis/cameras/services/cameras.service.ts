import { Readable } from 'node:stream';
import { HttpException } from '@exceptions/HttpException';
import { Camera, CameraCreateBody, CameraUpdateBody } from '@/apis/cameras/interfaces/cameras.interface';
import { isEmpty } from '@/utils/util';
import { CameraRepository } from '@/apis/cameras/repositories/cameras.repository';
import { PaginationReqInterface } from '@/helpers/pagination.helper';
import { FileOBject, S3Service } from '@/utils/aws';

class CameraService {
  public cameraRepository = new CameraRepository();

  public async findAllCamera(paginationParams: PaginationReqInterface): Promise<Camera[]> {
    return this.cameraRepository.findAll(paginationParams);
  }

  public async findCameraById(cameraId: string): Promise<Camera> {
    if (isEmpty(cameraId)) throw new HttpException(400, 'You not send cameraId');

    const findCamera: Camera = await this.cameraRepository.findById(cameraId);
    if (!findCamera) throw new HttpException(409, 'Not find camera');

    return findCamera;
  }

  public async findCameraBySerialNumber(serialNumber: string): Promise<Camera> {
    if (isEmpty(serialNumber)) throw new HttpException(400, 'You not send serialNumber');

    const findCamera: Camera = await this.cameraRepository.findOne({ serialNumber });

    return findCamera ? findCamera : null;
  }

  public async validateWarranty(serialNumber: string): Promise<boolean> {
    if (isEmpty(serialNumber)) throw new HttpException(400, 'You not send serialNumber');

    const findCamera: Camera = await this.cameraRepository.findOne({ serialNumber });

    const dateToday = new Date();
    const warrantyDate = new Date(findCamera.warrantyFinishDate);

    return dateToday < warrantyDate ? true : false;
  }

  public async createCamera(cameraData: CameraCreateBody): Promise<Camera> {
    if (isEmpty(cameraData)) throw new HttpException(400, 'You not send cameraData');

    const findCamera: Camera = await this.cameraRepository.findOne({ serialNumber: cameraData.serialNumber });
    if (findCamera) throw new HttpException(409, `This camera document ${cameraData.serialNumber} already exists`);

    const createCameraData: Camera = await this.cameraRepository.create(cameraData);
    return createCameraData;
  }

  public async updateCamera(cameraId: string, cameraData: CameraUpdateBody): Promise<Camera> {
    if (isEmpty(cameraData)) throw new HttpException(400, 'You not send cameraData');

    const findCamera: Camera = await this.cameraRepository.findById(cameraId);
    if (!findCamera) throw new HttpException(409, 'Not find camera');

    await this.cameraRepository.update(cameraData, cameraId);

    const updateCamera: Camera = await this.cameraRepository.findById(cameraId);
    return updateCamera;
  }

  public async deleteCamera(cameraId: string): Promise<Camera> {
    if (isEmpty(cameraId)) throw new HttpException(400, 'You not send cameraId');

    const findCamera: Camera = await this.cameraRepository.findById(cameraId);
    if (!findCamera) throw new HttpException(409, 'Not find camera');

    await this.cameraRepository.destroy(findCamera.id);

    return findCamera;
  }

  public async cameraCount(where?: string): Promise<number> {
    return this.cameraRepository.count(where ? { where: JSON.parse(where) } : undefined);
  }

  public async cameraUploadFile(cameraId: string, fileName: string, fileBuffer: Readable): Promise<FileOBject[]> {
    if (isEmpty(cameraId)) throw new HttpException(400, 'You not send cameraId');

    const findCamera: Camera = await this.cameraRepository.findById(cameraId);
    if (!findCamera) throw new HttpException(409, 'Not find camera');

    const s3Service = new S3Service();

    const awsUpload = s3Service.uploadEntityFiles('cameras', cameraId, fileName, fileBuffer);
    await awsUpload.done();

    return s3Service.listEntityFiles('cameras', cameraId);
  }

  public async cameraFilesList(cameraId: string): Promise<FileOBject[]> {
    if (isEmpty(cameraId)) throw new HttpException(400, 'You not send cameraId');

    const findCamera: Camera = await this.cameraRepository.findById(cameraId);
    if (!findCamera) throw new HttpException(409, 'Not find camera');

    return new S3Service().listEntityFiles('cameras', cameraId);
  }

  public async cameraFilesDelete(cameraId: string, fileName: string): Promise<FileOBject[]> {
    if (isEmpty(cameraId)) throw new HttpException(400, 'You not send cameraId');

    const findCamera: Camera = await this.cameraRepository.findById(cameraId);
    if (!findCamera) throw new HttpException(409, 'Not find camera');

    const s3Service = new S3Service();
    await s3Service.deleteFile(fileName);

    return s3Service.listEntityFiles('cameras', cameraId);
  }
}

export default CameraService;
