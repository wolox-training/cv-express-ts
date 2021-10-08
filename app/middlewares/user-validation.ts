import { IsString, Matches } from 'class-validator';
import { NextFunction, Request, Response } from 'express';

import { requestValidation } from '../utils/request-validation';

class User {
  @IsString()
  name: string;

  @IsString()
  lastName: string;

  @IsString()
  @Matches(/@wolox\.co$/, { message: 'email does not belong to domain' })
  email: string;

  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, { message: 'password too weak' })
  password: string;
}

export async function userValidation(req: Request, res: Response, next: NextFunction): Promise<void> {
  const validationErrors = await requestValidation(User, req);
  if (validationErrors) {
    res.status(422).json({ message: 'user validation failed', errors: validationErrors });
  } else {
    next();
  }
}
