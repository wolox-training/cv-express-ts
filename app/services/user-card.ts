import { FindConditions, getRepository, Repository } from 'typeorm';

import { UserCard } from '../models/user-card';

const userRepository = (): Repository<UserCard> => getRepository(UserCard);

export function findUserCard(options?: FindConditions<UserCard>): Promise<UserCard | undefined> {
  return userRepository().findOne(options);
}

export function createAndSave(userCard: UserCard): Promise<UserCard> {
  return userRepository().save(userCard);
}
