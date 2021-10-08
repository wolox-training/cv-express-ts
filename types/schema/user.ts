import { IsString, Matches } from 'class-validator';

export class User {
  @IsString()
  name: string;

  @IsString()
  lastName: string;

  @IsString()
  @Matches(/@wolox.co$/, { message: 'email does not belong to domain' })
  email: string;

  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, { message: 'password too weak' })
  password: string;
}
