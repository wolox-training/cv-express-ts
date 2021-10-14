import { IsNumberString } from 'class-validator';

export class QueryUsers {
  @IsNumberString()
  cardId: string;
}
