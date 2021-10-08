import { IsString, Matches } from 'class-validator';

const message = 'The account or password is incorrect';

export class Login {
  @IsString()
  @Matches(/@wolox\.co$/, { message })
  email: string;

  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, { message })
  password: string;
}
