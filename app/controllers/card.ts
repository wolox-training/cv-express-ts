import { Request, Response } from 'express';

import { CardInfo, Cards } from '../../types/app/card';
import { cards, info } from '../services/card';

export function getInfo(_: Request, res: Response): void {
  info().then((result: CardInfo) => res.json(result));
}

export function getCards(_: Request, res: Response): void {
  cards().then((result: Cards) => res.json(result));
}
