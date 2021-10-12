import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import HttpStatus from 'http-status-codes';

import userService from '../services/users';
import { User } from '../models/user';
import { databaseError, notFoundError, unprocessableEntity } from '../errors';
import logger from '../logger';
import { checkEmail } from '../utils/check-email';
import { ERROR_MESSAGE } from '../constants/errors-message';
import { ROLES } from '../constants/app-contants';

export function getUsers(req: Request, res: Response, next: NextFunction): void {
  const page = Number(req.query.page);
  const take = Number(req.query.limit);
  const skip = (page - 1) * take;
  if (take && page >= 0) {
    userService
      .findAll({
        skip,
        take
      })
      .then((users: User[]) => res.send(users))
      .catch((e: Error) => {
        logger.error(e);
        next(e);
      });
  } else {
    res.send(unprocessableEntity(ERROR_MESSAGE.QUERY_USER));
  }
}

export function createUser(role: string): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const data = req.body;
    const errorEmail = await checkEmail(data.email);
    if (errorEmail) {
      if (role === ROLES.ADMIN) {
        const user = await userService.findUser({ email: data.email });
        if (user && user.role !== ROLES.ADMIN) {
          user.role = ROLES.ADMIN;
          try {
            const userSaved = await userService.createAndSave(user);
            res.status(HttpStatus.OK).send({ id: userSaved.id });
            logger.info(`user ${userSaved.id} updated with role: ${ROLES.ADMIN}`);
            return;
          } catch (e) {
            const msg = 'error save user in database';
            logger.error(e);
            next(databaseError(msg));
            return;
          }
        }
      }
      logger.error(errorEmail.message);
      next(errorEmail);
      return;
    }
    const salt: number = process.env.SALT_PASSWORD ? Number(process.env.SALT_PASSWORD) : 10;
    const password = bcrypt.hashSync(data.password, salt);
    userService
      .createAndSave({
        name: data.name,
        lastName: data.lastName,
        email: data.email,
        password,
        role
      } as User)
      .then((user: User) => {
        res.status(HttpStatus.CREATED).send({ id: user.id });
        logger.info(`user created with email: ${data.email}`);
      })
      .catch(() => {
        const msg = 'error save user in database';
        logger.error(msg);
        next(databaseError(msg));
      });
  };
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
