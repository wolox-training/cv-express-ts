import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jwt-simple';

import userRepository from '../services/users';
import { authenticationError, databaseError } from '../errors';
import { LoginData } from '../../types/app/login-data';
import config from '../../config';
import logger from '../logger';

export async function singIn(req: Request, res: Response, next: NextFunction): Promise<void> {
  const data: LoginData = req.body;
  try {
    const user = await userRepository.findUser({
      email: data.email
    });
    const messageLoginFail = 'The account or password is incorrect';
    if (user) {
      bcrypt.compare(data.password, user.password, (err: Error, result: boolean) => {
        if (result) {
          const login = { id: user.id, role: 'user' };
          const token = jwt.encode(login, config.common.session.secret);
          res.json({ token });
        } else {
          next(authenticationError(messageLoginFail));
        }
      });
    } else {
      next(authenticationError(messageLoginFail));
    }
  } catch (e) {
    logger.error(e);
    next(databaseError('error in database server'));
  }
}
