import { Type } from 'class-transformer';
import { CreateClientDto } from '@/apis/clients/dtos/clients.dto';
import { IsString, IsBoolean, ValidateNested, IsInt, IsOptional } from 'class-validator';

export class CreateReportDto {
  @IsOptional()
  @IsInt()
  public number?: number;

  @IsString()
  public descriptionClient: string;

  @IsOptional()
  @IsString()
  public descriptionTech?: string;

  @IsBoolean()
  public pending: boolean;

  @IsBoolean()
  public denied: boolean;

  @IsString()
  public clientId: string;

  @IsString()
  public statusId: string;

  @IsString()
  public cameraId: string;

  @IsOptional()
  @IsString({ each: true })
  public servicesIDs?: string[];
}

export class CreatePublicReportDto {
  @IsString()
  public serialNumber: string;

  @IsString()
  public model: string;

  @IsString()
  public brand: string;

  @IsString()
  public descriptionClient: string;
}

export class PublicRequestDto {
  @ValidateNested({
    each: true,
  })
  @Type(() => CreatePublicReportDto)
  public reports: CreatePublicReportDto[];

  @ValidateNested()
  @Type(() => CreateClientDto)
  public client: Partial<CreateClientDto>;
}
