import { CONTACT } from '../constants'
import Effect from './effect'

export default class Weapon {
  label: string = '';
  contact: boolean = true;
  dices: number = 0;
  raw: number = 0;
  violenceDices: number = 0;
  violenceRaw: number = 0;
  range: string = CONTACT;
  effects: Effect[] = [];
}
