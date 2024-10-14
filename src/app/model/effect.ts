import { isString } from 'lodash'

export default class Effect {
	name: string = '';

	constructor(data?: any) {
		if (data) {
			this.import(data);
		}
	}

	import(data: any) {
		this.name = isString(data.name) ? data.name : '';
	}

	raw() {
    return this.name.replace(/\(.+\)|[0-9]/g, '').trim();
  }
}
