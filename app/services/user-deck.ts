import { FindConditions, getRepository, Repository } from 'typeorm';

import { UserDeck } from '../models/user-deck';

const userRepository = (): Repository<UserDeck> => getRepository(UserDeck);

export function findUserDeck(options?: FindConditions<UserDeck>): Promise<UserDeck | undefined> {
  return userRepository().findOne(options);
}

export function createAndSave(userDeck: UserDeck): Promise<UserDeck> {
  return userRepository().save(userDeck);
}
