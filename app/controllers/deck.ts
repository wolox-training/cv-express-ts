import { NextFunction, Request, Response } from 'express';

import { alreadyExistError, databaseError } from '../errors';
import { UserDeck } from '../models/user-deck';
import { createAndSave, findUserDeck } from '../services/user-deck';
import { HTTP_CODES } from '../constants';
import { info } from '../services/card';

export async function createDeck(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { deckClass } = req.body;
  const { classes } = await info();
  const cardSetExists = classes.some((name: string) => deckClass === name);
  if (!cardSetExists) {
    next(alreadyExistError);
    return;
  }
  const userId = req.user.id;
  const userDeck = {
    userId,
    deckClass
  };
  try {
    const card = await findUserDeck(userDeck);
    if (card) {
      next(alreadyExistError('The user already has the deck'));
      return;
    }
    const deck = await createAndSave(userDeck as UserDeck);
    res.status(HTTP_CODES.CREATED).send({ id: deck.id });
  } catch (e) {
    next(databaseError('error saving deck'));
  }
}
