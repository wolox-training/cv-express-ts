import { IsString, Matches } from 'class-validator';
import { NextFunction, Request, Response } from 'express';

import { requestValidation } from '../utils/request-validation';

const message = 'The account or password is incorrect';

class Login {
  @IsString()
  @Matches(/@wolox\.co$/, { message })
  email: string;

  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, { message })
  password: string;
}

export async function loginValidation(req: Request, res: Response, next: NextFunction): Promise<void> {
  const validationErrors = await requestValidation(Login, req);
  if (validationErrors) {
    res.status(401).json({ message, errors: validationErrors });
  } else {
    next();
  }
}
