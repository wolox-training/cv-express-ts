import axios, { AxiosRequestConfig } from 'axios';
import { CardInfo, Cards } from '../models/card';

class Card {
  options: AxiosRequestConfig = {
    method: 'GET',
    url: 'info',
    headers: {
      'x-rapidapi-host': 'omgvamp-hearthstone-v1.p.rapidapi.com',
      'x-rapidapi-key': 'a19852e8bfmsh934b970a1475291p1febc6jsn763992f393ef'
    }
  };

  info(): Promise<CardInfo> {
    return this.genericQuery('info') as Promise<CardInfo>;
  }

  cards(): Promise<Cards> {
    return this.genericQuery('allCards') as Promise<Cards>;
  }

  async genericQuery(endPoint: string): Promise<unknown> {
    const options = { ...this.options };
    options.url = this.getUrl(endPoint);
    const result = await axios.request(options);
    return result.data;
  }

  private getUrl(endPorint: string): string {
    return `https://omgvamp-hearthstone-v1.p.rapidapi.com/${endPorint}`;
  }
}
export const card = new Card();
