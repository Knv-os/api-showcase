import { IsString } from 'class-validator';

export class CreateStatusDto {
  @IsString()
  public name: string;

  @IsString()
  public backgroundColor: string;

  @IsString()
  public textColor: string;
}
