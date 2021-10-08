import jwt from 'jwt-simple';

import { User } from '../models/user';
import config from '../../config';

export function tokenCreation(user: User): string {
  const login = { id: user.id, role: 'user' };
  return jwt.encode(login, config.common.session.secret);
}
