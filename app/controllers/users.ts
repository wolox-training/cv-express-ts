import { NextFunction, Request, Response } from 'express';
import HttpStatus from 'http-status-codes';

import userService from '../services/users';
import { User } from '../models/user';
import { notFoundError } from '../errors';

export function getUsers(req: Request, res: Response, next: NextFunction): void {
  userService
    .findAll()
    .then((users: User[]) => res.send(users))
    .catch(next);
}

export function createUser(req: Request, res: Response, next: NextFunction): void {
  userService
    .createAndSave({
      name: req.body.name,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password
    } as User)
    .then((user: User) => res.status(HttpStatus.CREATED).send({ user }))
    .catch(next);
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
