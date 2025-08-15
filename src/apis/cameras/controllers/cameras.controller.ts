import { NextFunction, Request, Response } from 'express';
import { Camera, CameraCreateBody, CameraUpdateBody } from '@/apis/cameras/interfaces/cameras.interface';
import cameraService from '@/apis/cameras/services/cameras.service';
import { PaginationReqInterface, paginationResHelper, paginationSearchNormalize } from '@/helpers/pagination.helper';
import { RequestUpload } from '@/middlewares/upload.middleware';
import { FileOBject } from '@/utils/aws';

class CamerasController {
  public cameraService = new cameraService();
  private searchFields = ['idOrderOmie', 'model', 'brand', 'invoice', 'serialNumber'];

  public getCameras = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const paginationParams: PaginationReqInterface = paginationSearchNormalize(req.query, this.searchFields);
      const findAllCamerasData: Camera[] = await this.cameraService.findAllCamera(paginationParams);
      const countCameras: number = await this.cameraService.cameraCount(paginationParams.where);

      const paginationResponse = paginationResHelper({
        all: countCameras,
        page: paginationParams.page ? paginationParams.page : '1',
        perPage: paginationParams.perPage ? paginationParams.perPage : '20',
      });

      res.status(200).json({
        ...paginationResponse,
        data: findAllCamerasData,
      });
    } catch (error) {
      next(error);
    }
  };

  public getCameraById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cameraId = req.params.id;
      const findOneCameraData: Camera = await this.cameraService.findCameraById(cameraId);

      res.status(200).json(findOneCameraData);
    } catch (error) {
      next(error);
    }
  };

  public validateWarranty = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const serialNumber = req.params.serialNumber;
      const isWarrantyValid: boolean = await this.cameraService.validateWarranty(serialNumber);

      res.status(200).json({ success: isWarrantyValid });
    } catch (error) {
      next(error);
    }
  };

  public createCamera = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cameraData: CameraCreateBody = req.body;
      const createCameraData: Camera = await this.cameraService.createCamera(cameraData);

      res.status(201).json(createCameraData);
    } catch (error) {
      next(error);
    }
  };

  public updateCamera = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cameraId = req.params.id;
      const cameraData: CameraUpdateBody = req.body;
      const updateCameraData: Camera = await this.cameraService.updateCamera(cameraId, cameraData);

      res.status(200).json(updateCameraData);
    } catch (error) {
      next(error);
    }
  };

  public deleteCamera = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cameraId = req.params.id;
      await this.cameraService.deleteCamera(cameraId);

      res.status(200).send('ok');
    } catch (error) {
      next(error);
    }
  };

  public uploadFile = async (req: RequestUpload, res: Response, next: NextFunction) => {
    try {
      const cameraId = req.params.id;
      const cameraFilesList: FileOBject[] = await this.cameraService.cameraUploadFile(cameraId, req.file.originalname, req.file.buffer);

      res.status(200).json(cameraFilesList);
    } catch (error) {
      next(error);
    }
  };

  public filesList = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cameraId = req.params.id;
      const cameraFilesList: FileOBject[] = await this.cameraService.cameraFilesList(cameraId);

      res.status(200).json(cameraFilesList);
    } catch (error) {
      next(error);
    }
  };

  public filesDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cameraId = req.params.id;
      const fileName = `${req.query.fileName}`;
      const cameraFilesList: FileOBject[] = await this.cameraService.cameraFilesDelete(cameraId, fileName);

      res.status(200).json(cameraFilesList);
    } catch (error) {
      next(error);
    }
  };
}

export default CamerasController;
