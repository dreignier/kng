import { isString } from 'lodash'
import Entity from './entity'

export default class Vehicle extends Entity {
	description = ''
	armor = 0
	energy = 0
	forcefield = 0
	handling = 0
	speed = ''
	crew = ''
	weapons = ''

	constructor(data?: any) {
		super()

		if (data) {
			this.import(data)
		}
	}

	import(data: any) {
		this.name = isString(data.name) ? data.name : ''
		this.description = isString(data.description) ? data.description : ''
		this.armor = Number.isInteger(data.armor) ? data.armor : 0
		this.energy = Number.isInteger(data.energy) ? data.energy : 0
		this.forcefield = Number.isInteger(data.forcefield) ? data.forcefield : 0
		this.handling = Number.isInteger(data.handling) ? data.handling : 0
		this.speed = isString(data.speed) ? data.speed : ''
		this.crew = isString(data.crew) ? data.crew : ''
		this.weapons = isString(data.weapons) ? data.weapons : ''
	}
}
