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
