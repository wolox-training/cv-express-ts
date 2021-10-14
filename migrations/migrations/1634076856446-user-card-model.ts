import { MigrationInterface, QueryRunner, Table, TableUnique } from 'typeorm';

export class UserCardModel1634076856446 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_card',
        columns: [
          { name: 'id', type: 'int', isPrimary: true, generationStrategy: 'increment', isGenerated: true },
          { name: 'card_id', type: 'varchar' },
          { name: 'user_id', type: 'int' }
        ]
      })
    );
    await queryRunner.createUniqueConstraint(
      'users',
      new TableUnique({ columnNames: ['card_id', 'user_id'], name: 'user_card' })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropUniqueConstraint(
      'users_card',
      new TableUnique({ columnNames: ['card_id', 'user_id'], name: 'user_card' })
    );
    await queryRunner.dropTable('user_card');
  }
}
