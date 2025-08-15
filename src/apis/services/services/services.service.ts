import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import { PaginationReqInterface } from '@helpers/pagination.helper';
import { ServiceRepository } from '../repositories/services.repository';
import { Service, ServiceCreateBody, ServiceUpdateBody } from '../interfaces/services.interface';
import OmieService from '@/apis/omie/services/omie.service';
import { NODE_ENV } from '@/config';

class ServicesService {
  private serviceRepository = new ServiceRepository();
  private omieService = new OmieService();

  public async findAllServices(paginationParams: PaginationReqInterface): Promise<Service[]> {
    return this.serviceRepository.findAll(paginationParams);
  }

  public async findServiceById(serviceId: string): Promise<Service> {
    if (isEmpty(serviceId)) throw new HttpException(400, 'You not send userId');

    const findService: Service = await this.serviceRepository.findById(serviceId);
    if (!findService) throw new HttpException(409, 'Not find user');

    return findService;
  }

  public async createService(serviceData: ServiceCreateBody): Promise<Service> {
    if (isEmpty(serviceData)) throw new HttpException(400, 'You not send serviceData');

    const createServiceData: Service = await this.serviceRepository.create(serviceData);
    if (NODE_ENV !== 'development') {
      const omieService: any = await this.omieService.createService(createServiceData);
      return this.updateService(createServiceData.id, { idOmie: `${omieService.nCodServ}` });
    } else {
      return createServiceData;
    }
  }

  public async updateService(serviceId: string, serviceData: ServiceUpdateBody): Promise<Service> {
    if (isEmpty(serviceData)) throw new HttpException(400, 'You not send serviceData');

    const findService: Service = await this.serviceRepository.findById(serviceId);
    if (!findService) throw new HttpException(409, 'Not find service');

    await this.serviceRepository.update(serviceData, serviceId);

    const updateService: Service = await this.serviceRepository.findById(serviceId);

    if (NODE_ENV !== 'development') await this.omieService.updateService(updateService);
    return updateService;
  }

  public async deleteService(serviceId: string): Promise<Service> {
    if (isEmpty(serviceId)) throw new HttpException(400, 'You not send serviceId');

    const findService: Service = await this.serviceRepository.findById(serviceId);
    if (!findService) throw new HttpException(409, 'Not find service');

    await this.serviceRepository.destroy(findService.id);

    return findService;
  }

  public async serviceCount(where?: string): Promise<number> {
    return this.serviceRepository.count(where ? { where: JSON.parse(where) } : undefined);
  }
}

export default ServicesService;
