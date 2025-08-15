import { IsString } from 'class-validator';

export class CreateBillingDto {
  @IsString()
  public companyName: string;

  @IsString()
  public document: string;

  @IsString()
  public fantasyName: string;

  @IsString()
  public phone: string;

  @IsString()
  public street: string;

  @IsString()
  public neighborhood: string;

  @IsString()
  public number: string;

  @IsString()
  public unit: string;

  @IsString()
  public state: string;

  @IsString()
  public city: string;

  @IsString()
  public zipCode: string;

  @IsString()
  public clientId: string;
}
