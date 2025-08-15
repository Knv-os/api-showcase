import { IsBoolean, IsDate, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCameraDto {
  @IsString()
  public idOrderOmie?: string;

  @IsString()
  public model?: string;

  @IsString()
  public brand?: string;

  @IsString()
  public invoice?: string;

  @IsString()
  public serialNumber: string;

  @IsBoolean()
  public replaced?: boolean;

  @IsDate()
  @Type(() => Date)
  public warrantyFinishDate?: Date;
}
