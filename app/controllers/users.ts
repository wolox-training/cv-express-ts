import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import HttpStatus from 'http-status-codes';

import userService from '../services/users';
import { User } from '../models/user';
import { databaseError, notFoundError, unprocessableEntity } from '../errors';
import logger from '../logger';
import { checkPassword } from '../utils/check-password';
import { checkEmail } from '../utils/check-email';

export function getUsers(req: Request, res: Response, next: NextFunction): void {
  userService
    .findAll()
    .then((users: User[]) => res.send(users))
    .catch(next);
}

export async function createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  const data = req.body;
  const errorEmail = await checkEmail(data.email);
  const errorPassword = checkPassword(data.password);
  if (errorEmail) {
    logger.error(errorEmail.message);
    next(errorEmail);
    return;
  }
  if (errorPassword) {
    logger.error(errorPassword);
    next(unprocessableEntity(errorPassword));
    return;
  }
  const salt: number = process.env.SALT_PASSWORD ? Number(process.env.SALT_PASSWORD) : 10;
  const password = bcrypt.hashSync(data.password, salt);
  userService
    .createAndSave({
      name: data.name,
      lastName: data.lastName,
      email: data.email,
      password
    } as User)
    .then((user: User) => {
      res.status(HttpStatus.CREATED).send({ user });
      logger.info(`user created with email: ${data.email}`);
    })
    .catch(() => {
      const msg = 'error save user in database';
      logger.error(msg);
      next(databaseError(msg));
    });
}

export function getUserById(req: Request, res: Response, next: NextFunction): void {
  userService
    .findUser({ id: parseInt(req.params.id) })
    .then((user: User) => {
      if (!user) {
        throw notFoundError('User not found');
      }
      return res.send(user);
    })
    .catch(next);
}
