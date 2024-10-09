import { CONTACT } from '../constants'
import Effect from './effect'

export default class Weapon {
  name: string = '';
  contact: boolean = true;
  dices: number = 0;
  raw: number = 0;
  violenceDices: number = 0;
  violenceRaw: number = 0;
  range: string = CONTACT;
  effects: Effect[] = [];

	newEffect() {
		this.effects.push(new Effect());
	}
}
