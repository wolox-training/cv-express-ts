import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user_deck' })
export class UserDeck {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'deck_class', type: 'varchar' })
  deckClass: string;

  @Column({ name: 'user_id', type: 'varchar' })
  userId: string;
}
