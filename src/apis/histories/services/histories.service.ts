import { HttpException } from '@exceptions/HttpException';
import { History, HistoryCreateBody, HistoryUpdateBody } from '@/apis/histories/interfaces/histories.interface';
import { HistoryRepository } from '@/apis/histories/repositories/histories.repository';
import { PaginationReqInterface } from '@/helpers/pagination.helper';
import { isEmpty } from '@/utils/util';

class HistoryService {
  public historyRepository = new HistoryRepository();

  public async findAllHistory(paginationParams: PaginationReqInterface): Promise<History[]> {
    return this.historyRepository.findAll(paginationParams);
  }

  public async findHistoryById(historyId: string): Promise<History> {
    if (isEmpty(historyId)) throw new HttpException(400, 'You not send historyId');

    const findHistory: History = await this.historyRepository.findById(historyId);
    if (!findHistory) throw new HttpException(409, 'Not find history');

    return findHistory;
  }

  public async createHistory(historyData: HistoryCreateBody): Promise<History> {
    if (isEmpty(historyData)) throw new HttpException(400, 'You not send historyData');

    const createHistoryData: History = await this.historyRepository.create(historyData);
    return createHistoryData;
  }

  public async updateHistory(historyId: string, historyData: HistoryUpdateBody): Promise<History> {
    if (isEmpty(historyData)) throw new HttpException(400, 'You not send historyData');

    const findHistory: History = await this.historyRepository.findById(historyId);
    if (!findHistory) throw new HttpException(409, 'Not find history');

    await this.historyRepository.update(historyData, historyId);

    const updateHistory: History = await this.historyRepository.findById(historyId);
    return updateHistory;
  }

  public async deleteHistory(historyId: string): Promise<History> {
    if (isEmpty(historyId)) throw new HttpException(400, 'You not send historyId');

    const findHistory: History = await this.historyRepository.findById(historyId);
    if (!findHistory) throw new HttpException(409, 'Not find history');

    await this.historyRepository.destroy(findHistory.id);

    return findHistory;
  }

  public async historyCount(where?: string): Promise<number> {
    return this.historyRepository.count(where ? { where: JSON.parse(where) } : undefined);
  }
}

export default HistoryService;
