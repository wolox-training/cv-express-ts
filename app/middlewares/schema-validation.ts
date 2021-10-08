import { ClassType } from 'class-transformer-validator';
import { NextFunction, Request, Response } from 'express';

import { requestValidation } from '../utils/request-validation';

export function schemaValidation<T extends object>(
  classType: ClassType<T>,
  errorCode: number
): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const validationErrors = await requestValidation(classType, req);
    if (validationErrors) {
      res.status(errorCode).json({ message: 'user validation failed', errors: validationErrors });
    } else {
      next();
    }
  };
}
