import { transformAndValidate, ClassType } from 'class-transformer-validator';
import { ValidationError } from 'class-validator';
import { Request } from 'express';

export function requestValidation<T extends object>(
  classType: ClassType<T>,
  req: Request
): Promise<void | string[]> {
  return new Promise((resolve: Function) => {
    transformAndValidate(classType, req.body)
      .then(() => {
        resolve();
      })
      .catch((err: ValidationError) => {
        if (Array.isArray(err)) {
          const errors: string[] = [];
          err.forEach((error: ValidationError) => {
            if (error.constraints) {
              const key = Object.keys(error.constraints)[0];
              errors.push(`${error.property}: ${error.constraints[key]}`);
            }
          });
          resolve(errors);
        }
      });
  });
}
