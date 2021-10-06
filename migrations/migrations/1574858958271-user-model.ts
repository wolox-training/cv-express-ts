import { MigrationInterface, QueryRunner, Table, TableUnique } from 'typeorm';

export class UserModel1574858958271 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'Users',
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
      'Users',
      new TableUnique({ columnNames: ['email'], name: 'email' })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropUniqueConstraint(
      'User',
      new TableUnique({ columnNames: ['email'], name: 'email' })
    );
    await queryRunner.dropTable('User');
  }
}
