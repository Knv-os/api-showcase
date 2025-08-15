import { IsString, IsJSON } from 'class-validator';

export class PaginationDto {
  @IsString()
  public page: string;

  @IsString()
  public perPage: string;

  @IsJSON()
  public sortBy: string;

  @IsJSON()
  public where: string;

  @IsString()
  public search: string;
}

export interface PaginationReqInterface {
  page?: string;
  perPage?: string;
  sortBy?: any;
  where?: any;
  search?: string;
}

export interface PaginationResInterface {
  page: number;
  perPage: number;
  maxPages: number;
  totalItems: number;
}

export interface PaginationHelperResInterface {
  all: number;
  page: string;
  perPage: string;
}

export const paginationReqHelper = (params: PaginationReqInterface): any => {
  if (!params) return undefined;
  let page: number;
  const perPage: number = params.perPage ? parseInt(params.perPage, 10) : 100;

  if (params.page !== '1') {
    page = parseInt(params.page, 10);
  }

  return {
    skip: page ? page * perPage - perPage : 0,
    take: perPage,
    orderBy: params.sortBy ? JSON.parse(params.sortBy) : { createdAt: 'desc' },
    where: params.where ? JSON.parse(params.where) : undefined,
  };
};

export const paginationResHelper = (params: PaginationHelperResInterface) => {
  return {
    meta: {
      page: parseInt(params.page),
      perPage: parseInt(params.perPage),
      maxPages: Math.ceil(params.all / parseInt(params.perPage)),
      totalItems: params.all,
    },
  };
};

export const paginationSearchNormalize = (paginationParams: PaginationReqInterface, fields: any): PaginationReqInterface => {
  if (paginationParams.search) {
    const value: any = { contains: paginationParams.search, mode: 'insensitive' };

    const orFields = fields.map((val: string) => {
      if (val.includes('.')) {
        const splitValue = val.split('.');
        return {
          [splitValue[0]]: {
            [splitValue[1]]: value,
          },
        };
      }
      return { [val]: value };
    });

    paginationParams.where = JSON.stringify({
      AND: [
        { deleted: false },
        {
          OR: orFields,
        },
      ],
    });
  }

  return paginationParams;
};
