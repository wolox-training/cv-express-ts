import { IsString } from 'class-validator';

export class UserDeck {
  @IsString()
  deckClass: string;
}
