import { Readable } from 'node:stream';
import { CreatePublicClientDto } from '@/apis/clients/dtos/clients.dto';
import { HttpException } from '@exceptions/HttpException';
import { Client, ClientCreateBody, ClientUpdateBody } from '@/apis/clients/interfaces/clients.interface';
import { isEmpty } from '@/utils/util';
import { ClientRepository } from '@/apis/clients/repositories/clients.repository';
import { PaginationReqInterface } from '@/helpers/pagination.helper';
import { FileOBject, S3Service } from '@/utils/aws';

class ClientService {
  public clientRepository = new ClientRepository();

  public async findAllClient(paginationParams: PaginationReqInterface): Promise<Client[]> {
    return this.clientRepository.findAll(paginationParams);
  }

  public async findClientById(clientId: string): Promise<Client> {
    if (isEmpty(clientId)) throw new HttpException(400, 'You not send clientId');

    const findClient: Client = await this.clientRepository.findById(clientId);
    if (!findClient) throw new HttpException(409, 'Not find client');

    return findClient;
  }

  public async createClient(clientData: ClientCreateBody): Promise<Client> {
    if (isEmpty(clientData)) throw new HttpException(400, 'You not send clientData');

    const findClient: Client = await this.clientRepository.findOne({ email: clientData.email });
    if (findClient) throw new HttpException(409, `This client email ${clientData.email} already exists`);

    const createClientData: Client = await this.clientRepository.create(clientData);
    return createClientData;
  }

  public async updateClient(clientId: string, clientData: ClientUpdateBody): Promise<Client> {
    if (isEmpty(clientData)) throw new HttpException(400, 'You not send clientData');

    const findClient: Client = await this.clientRepository.findById(clientId);
    if (!findClient) throw new HttpException(409, 'Not find client');

    await this.clientRepository.update(clientData, clientId);

    const updateClient: Client = await this.clientRepository.findById(clientId);
    return updateClient;
  }

  public async deleteClient(clientId: string): Promise<Client> {
    if (isEmpty(clientId)) throw new HttpException(400, 'You not send clientId');

    const findClient: Client = await this.clientRepository.findById(clientId);
    if (!findClient) throw new HttpException(409, 'Not find client');

    await this.clientRepository.destroy(findClient.id);

    return findClient;
  }

  public async createClientIfNotExists(clientData: CreatePublicClientDto): Promise<Client> {
    if (isEmpty(clientData)) throw new HttpException(400, 'You not send clientData');

    const findClient: Client = await this.clientRepository.findOne({ document: clientData.document });

    let client: Client;

    if (!findClient) {
      client = await this.clientRepository.create({
        ...clientData,
        partner: false,
      });
    } else {
      client = findClient;
    }
    return client;
  }

  public async clientCount(where?: string): Promise<number> {
    return this.clientRepository.count(where ? { where: JSON.parse(where) } : undefined);
  }

  public async clientUploadFile(clientId: string, fileName: string, fileBuffer: Readable): Promise<FileOBject[]> {
    if (isEmpty(clientId)) throw new HttpException(400, 'You not send clientId');

    const findClient: Client = await this.clientRepository.findById(clientId);
    if (!findClient) throw new HttpException(409, 'Not find client');

    const s3Service = new S3Service();

    const awsUpload = s3Service.uploadEntityFiles('clients', clientId, fileName, fileBuffer);
    await awsUpload.done();

    return s3Service.listEntityFiles('clients', clientId);
  }

  public async clientFilesList(clientId: string): Promise<FileOBject[]> {
    if (isEmpty(clientId)) throw new HttpException(400, 'You not send clientId');

    const findClient: Client = await this.clientRepository.findById(clientId);
    if (!findClient) throw new HttpException(409, 'Not find client');

    return new S3Service().listEntityFiles('clients', clientId);
  }

  public async clientFilesDelete(clientId: string, fileName: string): Promise<FileOBject[]> {
    if (isEmpty(clientId)) throw new HttpException(400, 'You not send clientId');

    const findClient: Client = await this.clientRepository.findById(clientId);
    if (!findClient) throw new HttpException(409, 'Not find client');

    const s3Service = new S3Service();
    await s3Service.deleteFile(fileName);

    return s3Service.listEntityFiles('clients', clientId);
  }
}

export default ClientService;
