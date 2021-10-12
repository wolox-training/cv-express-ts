import { Response, NextFunction, Request } from 'express';

import SessionManager, { HEADER_NAME } from '../services/session';
import userService from '../services/users';
import { User } from '../models/user';
import { ROLES } from '../constants/app-contants';
import { HTTP_CODES } from '../constants';
import { ERROR_MESSAGE } from '../constants/errors-message';

export async function secure(req: Request, res: Response, next: NextFunction): Promise<void> {
  const auth = req.headers[HEADER_NAME] as string;

  if (auth) {
    const payload: User = SessionManager.decode(auth);
    const user: User | undefined = await userService.findUser({ id: payload.id });
    if (user) {
      req.user = user;
      next();
      return;
    }
  }
  res.status(HTTP_CODES.UNAUTHORIZED).json({ message: ERROR_MESSAGE.UNAUTHORIZED });
}

export function roleAdmin(req: Request, res: Response, next: NextFunction): void {
  if (req.user && req.user.role === ROLES.ADMIN) {
    next();
    return;
  }
  res.status(HTTP_CODES.UNAUTHORIZED).json({ message: ERROR_MESSAGE.UNAUTHORIZED });
}
