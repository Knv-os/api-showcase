import { S3Client, ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { HttpException } from '@exceptions/HttpException';
import { Upload } from '@aws-sdk/lib-storage';
import { Readable } from 'node:stream';
import { NodeJsClient } from '@smithy/types';
import { AWS_BUCKET_S3_NAME } from '@config';
import { logger } from './logger';

export interface FileOBject {
  name: string;
  sourceName: string;
  url: string;
  date: Date;
  size: number;
}

export class S3Service {
  constructor(private readonly s3Client = new S3Client({ region: 'sa-east-1' }) as NodeJsClient<S3Client>) {}

  public uploadFile(path: string, Body: Readable): Upload {
    console.log(path);
    const resp = new Upload({
      client: this.s3Client,
      params: {
        Bucket: AWS_BUCKET_S3_NAME,
        Key: path,
        Body,
      },
    });
    return resp;
  }

  public uploadEntityFiles(entity: string, entityId: string, fileName: string, Body: Readable): Upload {
    return this.uploadFile(`${entity}/${entityId}/${Date.now()}___${fileName}`, Body);
  }

  public async listFiles(path: string): Promise<FileOBject[]> {
    const command = new ListObjectsV2Command({
      Bucket: AWS_BUCKET_S3_NAME,
      MaxKeys: 100,
      Prefix: path,
    });

    let isTruncated = true;
    let contents: FileOBject[];

    try {
      while (isTruncated) {
        const { Contents, IsTruncated, NextContinuationToken } = await this.s3Client.send(command);
        if (Contents) {
          contents = Contents.map((c: any) => {
            const name = c.Key.split('___');
            return {
              name: name[1],
              sourceName: c.Key,
              url: `https://${AWS_BUCKET_S3_NAME}.s3.sa-east-1.amazonaws.com/${c.Key}`,
              date: new Date(c.LastModified),
              size: c.Size,
            };
          });
        }
        isTruncated = IsTruncated;
        command.input.ContinuationToken = NextContinuationToken;
      }
    } catch (err) {
      throw new HttpException(500, 'List files error');
    }

    return contents;
  }

  public async listEntityFiles(entity: string, entityId: string): Promise<FileOBject[]> {
    return this.listFiles(`${entity}/${entityId}`);
  }

  public async deleteFile(path: string): Promise<any> {
    const command = new DeleteObjectCommand({
      Bucket: AWS_BUCKET_S3_NAME,
      Key: path,
    });

    try {
      return this.s3Client.send(command);
    } catch (err) {
      logger.error(err);
    }
  }
}
