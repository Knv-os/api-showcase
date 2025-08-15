import { HttpException } from '@exceptions/HttpException';
import { Status, StatusCreateBody, StatusUpdateBody } from '@/apis/status/interfaces/status.interface';
import { StatusRepository } from '@/apis/status/repositories/status.repository';
import { PaginationReqInterface } from '@/helpers/pagination.helper';
import { isEmpty } from '@/utils/util';

class StatusService {
  public statusRepository = new StatusRepository();

  public async findAllStatus(paginationParams: PaginationReqInterface): Promise<Status[]> {
    return this.statusRepository.findAll(paginationParams);
  }

  public async findStatusById(statusId: string): Promise<Status> {
    if (isEmpty(statusId)) throw new HttpException(400, 'You not send statusId');

    const findStatus: Status = await this.statusRepository.findById(statusId);
    if (!findStatus) throw new HttpException(409, 'Not find status');

    return findStatus;
  }

  public async createStatus(statusData: StatusCreateBody): Promise<Status> {
    if (isEmpty(statusData)) throw new HttpException(400, 'You not send statusData');

    const findStatus: Status = await this.statusRepository.findOne({ name: statusData.name });
    if (findStatus) throw new HttpException(409, ` ${statusData.name} already exists`);

    const createStatusData: Status = await this.statusRepository.create(statusData);
    return createStatusData;
  }

  public async updateStatus(statusId: string, statusData: StatusUpdateBody): Promise<Status> {
    if (isEmpty(statusData)) throw new HttpException(400, 'You not send statusData');

    const findStatus: Status = await this.statusRepository.findById(statusId);
    if (!findStatus) throw new HttpException(409, 'Not find status');

    await this.statusRepository.update(statusData, statusId);

    const updateStatus: Status = await this.statusRepository.findById(statusId);
    return updateStatus;
  }

  public async deleteStatus(statusId: string): Promise<Status> {
    if (isEmpty(statusId)) throw new HttpException(400, 'You not send statusId');

    const findStatus: Status = await this.statusRepository.findById(statusId);
    if (!findStatus) throw new HttpException(409, 'Not find status');

    await this.statusRepository.destroy(findStatus.id);

    return findStatus;
  }

  public async statusCount(where?: string): Promise<number> {
    return this.statusRepository.count(where ? { where: JSON.parse(where) } : undefined);
  }
}

export default StatusService;
