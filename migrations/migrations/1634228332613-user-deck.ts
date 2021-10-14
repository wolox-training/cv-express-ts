import { MigrationInterface, QueryRunner, Table, TableUnique } from 'typeorm';

export class UserDeckModel1634228332613 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_deck',
        columns: [
          { name: 'id', type: 'int', isPrimary: true, generationStrategy: 'increment', isGenerated: true },
          { name: 'card_set', type: 'varchar' },
          { name: 'user_id', type: 'int' }
        ]
      })
    );
    await queryRunner.createUniqueConstraint(
      'users',
      new TableUnique({ columnNames: ['card_set', 'user_id'], name: 'user_deck' })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropUniqueConstraint(
      'users_deck',
      new TableUnique({ columnNames: ['card_set', 'user_id'], name: 'user_deck' })
    );
    await queryRunner.dropTable('user_card');
  }
}
