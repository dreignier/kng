export default class Aspect {
	id: number = 0
	score: number = 0
  exceptional: number = 0
  major: boolean = false;

	constructor(data?: any) {
		if (data) {
			this.import(data);
		}
	}

	import(data: any) {
		this.id = Number.isInteger(data.id) ? data.id : 0
		this.score = Number.isInteger(data.score) ? data.score : 0
		this.exceptional = Number.isInteger(data.exceptional) ? data.exceptional : 0
		this.major = data.major === true
	}
}
