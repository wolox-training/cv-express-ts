import axios, { AxiosRequestConfig } from 'axios';
import { CardInfo, Cards } from '../../types/app/card';

const genericOptions: AxiosRequestConfig = {
  method: 'GET',
  url: 'info',
  headers: {
    'x-rapidapi-host': 'omgvamp-hearthstone-v1.p.rapidapi.com',
    'x-rapidapi-key': process.env.RAPIDAPI_KEY
  }
};

function getUrl(endPorint: string): string {
  return `https://omgvamp-hearthstone-v1.p.rapidapi.com/${endPorint}`;
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
