import { NextFunction, Request, Response } from 'express';

import { createAndSave, findUserCard } from '../services/user-card';
import { CardInfo, Cards } from '../../types/app/card';
import { cardInfo, cards, info } from '../services/card';
import { alreadyExistError, conflictRequest, databaseError, notFoundError } from '../errors';
import { UserCard } from '../models/user-card';
import { HTTP_CODES } from '../constants';
import { APP } from '../constants/app';
import { findUserDeck } from '../services/user-deck';

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
    const card = await findUserCard(userCard);
    if (card) {
      next(alreadyExistError('The user already has the card'));
      return;
    }
    await createAndSave(userCard as UserCard);
    res.status(HTTP_CODES.CREATED).send();
  } catch (e) {
    next(databaseError(''));
  }
}

export async function addCard(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { cardId, deckClass } = req.body;
  const userId = req.user.id;
  const userCard = {
    cardId,
    userId
  };
  try {
    // The user bought the card
    const card = await findUserCard(userCard);
    if (!card) {
      next(notFoundError('the user has not bought the card'));
      return;
    }
    // deck Neutral allow any card
    if (deckClass === APP.NEUTRAL) {
      card.deckClass = APP.NEUTRAL;
    } else {
      const cardData = await cardInfo(card.cardId);
      // card Neutral allow any deck class
      if (cardData.playerClass === APP.NEUTRAL) {
        card.deckClass = deckClass;
      } else if (cardData.playerClass === deckClass) {
        const userDeck = await findUserDeck({ deckClass, userId });
        // the user has the deck
        // assign card to deck
        if (userDeck) {
          card.deckClass = deckClass;
        }
      }
    }
    // Verify card changes
    if (card.deckClass) {
      await createAndSave(card);
      res.status(HTTP_CODES.OK).json({});
      return;
    }
    next(conflictRequest('the card could not be saved'));
  } catch (e) {
    next(databaseError('error saving card in deck'));
  }
}
