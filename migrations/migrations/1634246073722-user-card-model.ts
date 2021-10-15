import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserCardModel1634246073722 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE users ADD deck int NULL');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE users DROP COLUMN role');
  }
}
