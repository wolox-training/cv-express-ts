export interface CardInfo {
  patch: string;
  classes: string[];
  sets: string[];
  types: string[];
  factions: string[];
  qualities: string[];
  races: string[];
  locales: string[];
}

export interface Cards {
  [key: string]: string[];
}

export interface Card {
  cardId: string;
  dbfId: string;
  name: string;
  cardSet: string;
  type: string;
  faction: string;
  cost: number;
  playerClass: string;
  locale: string;
}
