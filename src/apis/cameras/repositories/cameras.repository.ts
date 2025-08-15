import { Prisma } from '@prisma/client';
import { prisma } from '@databases';
import { Camera, CameraFindWhere, CameraCreateBody, CameraUpdateBody } from '@/apis/cameras/interfaces/cameras.interface';
import { PaginationReqInterface, paginationReqHelper } from '@/helpers/pagination.helper';

export class CameraRepository {
  public async findAll(paginationParams?: PaginationReqInterface, options?: Prisma.CamerasFindManyArgs): Promise<Camera[]> {
    const cameras = await prisma.cameras.findMany({ ...paginationReqHelper(paginationParams), ...options });

    return cameras;
  }

  public async findById(cameraId: string): Promise<Camera> {
    const result = await prisma.cameras.findUnique({ where: { id: cameraId } });
    return result;
  }

  public async findOne(options: CameraFindWhere): Promise<Camera | null> {
    const result = await prisma.cameras.findFirst({ where: { ...options } });

    return result ? result : null;
  }

  public async create(cameraData: CameraCreateBody): Promise<Camera> {
    return prisma.cameras.create({ data: cameraData });
  }

  public async update(cameraData: CameraUpdateBody, cameraId: string): Promise<any> {
    return prisma.cameras.update({ where: { id: cameraId }, data: { ...cameraData } });
  }

  public async destroy(cameraId: string): Promise<Camera> {
    return prisma.cameras.delete({ id: cameraId });
  }

  public async count(where?: Prisma.Subset<Prisma.CamerasCountArgs, Prisma.CamerasCountArgs>): Promise<number> {
    return prisma.cameras.count({ ...where });
  }
}
