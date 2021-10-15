import { IsInt, IsString } from 'class-validator';

export class AddCard {
  @IsInt()
  deckClass: number;

  @IsString()
  cardId: string;
}
