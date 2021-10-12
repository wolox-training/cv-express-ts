import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserModel1633989433642 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE users ADD role varchar(20) DEFAULT 'user'");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE users DROP COLUMN role');
  }
}
