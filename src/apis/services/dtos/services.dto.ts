import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  public idOmie: string;

  @IsString()
  public name: string;

  @IsString()
  public pricing: string;

  @IsString()
  public pricingPartner: string;

  @IsArray()
  @IsOptional()
  public reportsIDs?: Array<string>;
}
