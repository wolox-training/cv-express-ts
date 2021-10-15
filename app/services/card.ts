import axios, { AxiosRequestConfig } from 'axios';

import { Card, CardInfo, Cards } from '../../types/app/card';
import config from '../../config';

const genericOptions: AxiosRequestConfig = {
  method: 'GET',
  url: 'info',
  headers: {
    'x-rapidapi-host': config.common.hearthstone.url,
    'x-rapidapi-key': config.common.hearthstone.key
  }
};

function getUrl(endPorint: string): string {
  return `https://${config.common.hearthstone.url}/${endPorint}`;
}

async function genericQuery(endPoint: string): Promise<unknown> {
  const options = { ...genericOptions };
  options.url = getUrl(endPoint);
  const result = await axios.request(options);
  return result.data;
}

export function info(): Promise<CardInfo> {
  return genericQuery('info') as Promise<CardInfo>;
}

export function cards(): Promise<Cards> {
  return genericQuery('allCards') as Promise<Cards>;
}

export function cardInfo(query: string): Promise<Card> {
  return genericQuery(`cards/${query}`) as Promise<Card>;
}
