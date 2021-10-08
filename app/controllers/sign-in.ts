import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';

import userRepository from '../services/users';
import { authenticationError, databaseError } from '../errors';
import { LoginData } from '../../types/app/login-data';
import logger from '../logger';
import { tokenCreation } from '../utils/token-creation';

export async function singIn(req: Request, res: Response, next: NextFunction): Promise<void> {
  const data: LoginData = req.body;
  try {
    const user = await userRepository.findUser({
      email: data.email
    });
    const messageLoginFail = 'The account or password is incorrect';
    if (user) {
      try {
        await bcrypt.compare(data.password, user.password).then(() => {
          const token = tokenCreation(user);
          res.json({ token });
        });
      } catch (e) {
        next(authenticationError(messageLoginFail));
      }
    } else {
      next(authenticationError(messageLoginFail));
    }
  } catch (e) {
    logger.error(e);
    next(databaseError('error in database server'));
  }
}
