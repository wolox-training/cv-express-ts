import { Application } from 'express';

import { AddCard } from '../types/schema/add-card';
import { UserDeck } from '../types/schema/user-deck';
import { QueryUsers } from '../types/schema/query-users';
import { healthCheck } from './controllers/healthCheck';
import { getUsers, getUserById, createUser } from './controllers/users';
import { getTodos } from './controllers/todos';
import { addCard, buyCard, getCards, getInfo } from './controllers/card';
import { singIn } from './controllers/sign-in';
import { schemaValidation } from './middlewares/schema-validation';
import { User } from '../types/schema/user';
import { HTTP_CODES } from './constants';
import { Login } from '../types/schema/login';
import { ERROR_MESSAGE } from './constants/errors-message';
import { secure } from './middlewares/auth';
import { createDeck } from './controllers/deck';
import { UserCard } from '../types/schema/user-card';

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
  app.post('/cards/:id', [secure], buyCard);
  app.get(
    '/cards/:id',
    [secure, schemaValidation(UserCard, ERROR_MESSAGE.BUY_CARD, HTTP_CODES.UNPROCESSABLE_ENTITY)],
    buyCard
  );
  app.post(
    '/decks',
    [secure, schemaValidation(UserDeck, ERROR_MESSAGE.CREATE_DECK, HTTP_CODES.UNPROCESSABLE_ENTITY)],
    createDeck
  );
  app.post(
    '/decks/:deck_id/cards',
    [secure, schemaValidation(AddCard, ERROR_MESSAGE.ADD_CARD, HTTP_CODES.UNPROCESSABLE_ENTITY)],
    addCard
  );
};
