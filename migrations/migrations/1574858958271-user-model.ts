import { MigrationInterface, QueryRunner, Table, TableUnique } from 'typeorm';

export class UserModel1574858958271 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          { name: 'id', type: 'int', isPrimary: true, generationStrategy: 'increment', isGenerated: true },
          { name: 'name', type: 'varchar' },
          { name: 'last_name', type: 'varchar' },
          { name: 'email', type: 'varchar' },
          { name: 'password', type: 'varchar' }
        ]
      })
    );
    await queryRunner.createUniqueConstraint(
      'users',
      new TableUnique({ columnNames: ['email'], name: 'email' })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropUniqueConstraint(
      'users',
      new TableUnique({ columnNames: ['email'], name: 'email' })
    );
    await queryRunner.dropTable('users');
  }
}
