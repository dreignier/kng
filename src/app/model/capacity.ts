import { isString } from 'lodash'

export default class Capacity {
	name: string = '';
	description: string = '';

	constructor(data?: any) {
		if (data) {
			this.import(data);
		}
	}

	import(data: any) {
		this.name = isString(data.name) ? data.name : '';
		this.description = isString(data.description) ? data.description : '';
	}
}
