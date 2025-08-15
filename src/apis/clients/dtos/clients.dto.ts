import { IsString, IsEmail, IsBoolean } from 'class-validator';

export class CreateClientDto {
  @IsString()
  public name: string;

  @IsEmail()
  public email: string;

  @IsString()
  public document: string;

  @IsString()
  public phone?: string;

  @IsString()
  public company?: string;

  @IsString()
  public description?: string;

  @IsBoolean()
  public partner: boolean;
}

export class CreatePublicClientDto {
  @IsString()
  public name: string;

  @IsString()
  public email: string;

  @IsString()
  public document: string;

  @IsString()
  public phone: string;

  @IsString()
  public company: string;
}
