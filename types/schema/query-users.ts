import { IsNumberString } from 'class-validator';

export class QueryUsers {
  @IsNumberString()
  limit: number;

  @IsNumberString()
  page: number;
}
