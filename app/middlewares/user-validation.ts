import { transformAndValidate } from 'class-transformer-validator';
import { IsString, Matches, ValidationError } from 'class-validator';

import { NextFunction, Request, Response } from 'express';

class User {
  @IsString()
  name: string;

  @IsString()
  lastName: string;

  @IsString()
  @Matches(/@wolox.co/, { message: 'email does not belong to domain' })
  email: string;

  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, { message: 'password too weak' })
  password: string;
}

export function userValidation(req: Request, res: Response, next: NextFunction): void {
  transformAndValidate(User, req.body)
    .then(() => {
      next();
    })
    .catch((err: ValidationError[]) => {
      const errors: string[] = [];
      err.forEach((error: ValidationError) => {
        if (error.constraints) {
          const key = Object.keys(error.constraints)[0];
          errors.push(`${error.property}: ${error.constraints[key]}`);
        }
      });
      res.status(422).json({ message: errors });
    });
}
