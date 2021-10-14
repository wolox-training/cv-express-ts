import { NextFunction, Request, Response } from 'express';

import { createAndSave, findUserCard } from '../services/user-card';
import { CardInfo, Cards } from '../../types/app/card';
import { cards, info } from '../services/card';
import { alreadyExistError, databaseError } from '../errors';
import { UserCard } from '../models/user-card';
import { HTTP_CODES } from '../constants';

export function getInfo(_: Request, res: Response): void {
  info().then((result: CardInfo) => res.json(result));
}

export function getCards(_: Request, res: Response): void {
  cards().then((result: Cards) => res.json(result));
}

export async function buyCard(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { cardId } = req.body;
  const userId = req.user.id;
  const userCard = {
    cardId,
    userId
  };
  try {
    let card = await findUserCard(userCard);
    if (card) {
      next(alreadyExistError('The user already has the card'));
      return;
    }
    card = await createAndSave(userCard as UserCard);
    res.status(HTTP_CODES.CREATED).send({ id: cardId });
  } catch (e) {
    next(databaseError('error saving buy card'));
  }
}
