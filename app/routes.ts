import { Application } from 'express';

import { QueryUsers } from '../types/schema/query-users';
import { healthCheck } from './controllers/healthCheck';
import { getUsers, getUserById, createUser, createUserAdmin } from './controllers/users';
import { getTodos } from './controllers/todos';
import { getCards, getInfo } from './controllers/card';
import { singIn } from './controllers/sign-in';
import { schemaValidation } from './middlewares/schema-validation';
import { User } from '../types/schema/user';
import { HTTP_CODES } from './constants';
import { Login } from '../types/schema/login';
import { ERROR_MESSAGE } from './constants/errors-message';
import { roleAdmin, secure } from './middlewares/auth';

export const init = (app: Application): void => {
  app.get('/health', healthCheck);
  app.get(
    '/users',
    [secure, schemaValidation(QueryUsers, ERROR_MESSAGE.QUERY_USER, HTTP_CODES.UNPROCESSABLE_ENTITY)],
    getUsers
  );
  app.post(
    '/users/sessions',
    [schemaValidation(Login, ERROR_MESSAGE.USER_VALIDATION, HTTP_CODES.UNAUTHORIZED)],
    singIn
  );
  app.post(
    '/users',
    [schemaValidation(User, ERROR_MESSAGE.USER_CREATION, HTTP_CODES.UNPROCESSABLE_ENTITY)],
    createUser
  );
  app.get('/users/:id', getUserById);
  app.get('/todos', getTodos);
  app.get('/info', getInfo);
  app.get('/cards', getCards);
  app.post(
    '/admin/users',
    [secure, roleAdmin, schemaValidation(User, ERROR_MESSAGE.USER_CREATION, HTTP_CODES.UNPROCESSABLE_ENTITY)],
    createUserAdmin
  );
};
