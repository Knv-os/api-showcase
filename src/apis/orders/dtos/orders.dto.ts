import { IsString, IsArray, IsBoolean } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  public idOmie?: string;

  @IsBoolean()
  public evaluationFee: boolean;

  @IsString()
  public billingId: string;

  @IsString()
  public shipping?: string;

  @IsArray()
  public reportsIDs: Array<string>;
}
