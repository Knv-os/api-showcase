import multer from 'multer';
import { Request } from 'express';
import { Readable } from 'node:stream';

export interface RequestUpload extends Request {
  file: MulterFile;
}

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: any;
  stream: Readable;
}

export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
});

export default uploadMiddleware;
