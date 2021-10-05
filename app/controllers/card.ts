import { Request, Response } from 'express';
import { card } from '../services/card';
import { CardInfo, Cards } from '../models/card';

export function getInfo(_: Request, res: Response): void {
  card.info().then((result: CardInfo) => res.json(result));
}

export function getCards(_: Request, res: Response): void {
  card.cards().then((result: Cards) => res.json(result));
}
