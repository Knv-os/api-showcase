import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken } from '@/apis/auth/interfaces/auth.interface';
import { UserRepository } from '@apis/users/repositories/users.repository';

const getDataToken = async (req: any): Promise<DataStoredInToken> => {
  try {
    const Authorization = req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);

    if (Authorization) {
      const secretKey: string = SECRET_KEY;
      const verificationResponse = verify(Authorization, secretKey) as DataStoredInToken;

      return verificationResponse;
    } else {
      return undefined;
    }
  } catch (error) {
    return undefined;
  }
};

const findAuthEntityRequest = async (authEntity: DataStoredInToken) => {
  const userRepository = new UserRepository();

  try {
    const authEntityId = authEntity.id;
    const findAuthEntity = await userRepository.findById(authEntityId);

    if (findAuthEntity) {
      return findAuthEntity;
    } else {
      return undefined;
    }
  } catch (error) {
    return undefined;
  }
};

export const authUserMiddleware = async (req: any, res: Response, next: NextFunction) => {
  try {
    const Authorization = await getDataToken(req);

    if (Authorization) {
      const findAuthEntity = await findAuthEntityRequest(Authorization);

      if (findAuthEntity) {
        req.authEntity = {
          ...findAuthEntity,
        };
        next();
      } else {
        next(new HttpException(401, 'Wrong authentication token'));
      }
    } else {
      next(new HttpException(404, 'Authentication token missing'));
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong authentication token'));
  }
};
