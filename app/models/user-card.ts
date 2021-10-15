import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user_card' })
export class UserCard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'card_id', type: 'varchar' })
  cardId: string;

  @Column({ name: 'user_id', type: 'varchar' })
  userId: string;

  @Column({ name: 'deck_class', type: 'varchar' })
  deckClass: string;
}
