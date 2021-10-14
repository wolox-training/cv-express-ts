import { IsNumberString } from 'class-validator';

export class UserDeck {
  @IsNumberString()
  deckName: string;
}
