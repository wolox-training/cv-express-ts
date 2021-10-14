import { IsNumberString } from 'class-validator';

export class UserCard {
  @IsNumberString()
  cardId: string;
}
