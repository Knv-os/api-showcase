import { IsString } from 'class-validator';

export class CreateHistoryDto {
  @IsString()
  public changeString: string;

  @IsString()
  public userId: string;

  @IsString()
  public reportId: string;
}
