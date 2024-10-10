import { isString } from 'lodash'
import { CONTACT, COURTE, LOINTAINE, LONGUE, MOYENNE } from '../constants'
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

	constructor(data?: any) {
		if (data) {
			this.import(data);
		}
	}

	import(data: any) {
		this.name = isString(data.name) ? data.name : '';
		this.contact = !!data.contact;
		this.dices = Number.isFinite(data.dices) ? data.dices : 0;
		this.raw = Number.isFinite(data.raw) ? data.raw : 0;
		this.violenceDices = Number.isFinite(data.violenceDices) ? data.violenceDices : 0;
		this.violenceRaw = Number.isFinite(data.violenceRaw) ? data.violenceRaw : 0;
		this.range = [CONTACT, COURTE, MOYENNE, LONGUE, LOINTAINE].includes(data.range?.toLowerCase?.()) ? data.range.toLowerCase() : (this.contact ? CONTACT : COURTE);
		this.effects = (Array.isArray(data.effects) ? data.effects : []).map((e: any) => new Effect(e));
	}

	newEffect() {
		this.effects.push(new Effect());
	}
}
