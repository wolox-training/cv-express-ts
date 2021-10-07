import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import HttpStatus from 'http-status-codes';

import userService from '../services/users';
import { User } from '../models/user';
import { notFoundError } from '../errors';
import logger from '../logger';

async function checkEmail(email: string): Promise<string> {
  const regexpEmail = /@wolox.co/;
  if (!regexpEmail.test(email)) {
    return 'email does not belong to domain';
  }
  const user = await userService.findUser({ email });
  return user ? 'the email is taken' : '';
}

function checkPassword(password: string): string {
  const regexpPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regexpPassword.test(password) ? '' : 'insecure password';
}

export function getUsers(req: Request, res: Response, next: NextFunction): void {
  userService
    .findAll()
    .then((users: User[]) => res.send(users))
    .catch(next);
}

export async function createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  const data = req.body;
  const errors: string[] = [];
  const errorEmail = await checkEmail(data.email);
  const errorPassword = checkPassword(data.password);
  if (errorEmail) {
    errors.push(errorEmail);
  }
  if (errorPassword) {
    errors.push(errorPassword);
  }
  if (errors.length) {
    res.status(HttpStatus.FORBIDDEN).json(errors);
    logger.error(`error creating user: ${errors.join(', ')}`);
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
      logger.error('error save user in database');
      next();
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
