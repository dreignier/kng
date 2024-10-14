import { isString } from 'lodash'
import { ADVANCED, HOPE, PRESTIGE, RARE, STANDARD } from '../constants'
import Effect from './effect'
import Entity from './entity'

export class Rule {
	name?: string
	level?: string = ''

	import(data: any) {
		this.name = isString(data.name) ? data.name : ''
		this.level = isString(data.level) ? data.level : ''
	}
}

export class DroneRule extends Rule {
	defense = 0
	reaction = 0
	armor = 0
	forcefield = 0
	speed = 0

	override import(data: any) {
		super.import(data)

		this.defense = Number.isInteger(data.defense) ? data.defense : 0
		this.reaction = Number.isInteger(data.reaction) ? data.reaction : 0
		this.armor = Number.isInteger(data.armor) ? data.armor : 0
		this.forcefield = Number.isInteger(data.forcefield) ? data.forcefield : 0
		this.speed = Number.isInteger(data.speed) ? data.speed : 0
	}
}

export class AttackRule extends Rule {
	damage: string = ''
	violence: string = ''
	range: string = ''
	energy: number = 0
	effects: Effect[] = []

	override import(data: any) {
		super.import(data)

		this.damage = isString(data.damage) ? data.damage : ''
		this.violence = isString(data.violence) ? data.violence : ''
		this.range = isString(data.range) ? data.range : ''
		this.energy = Number.isInteger(data.energy) ? data.energy : 0
		this.effects = (Array.isArray(data.effects) ? data.effects : []).map((e: any) => new Effect(e));
	}

	newEffect() {
		this.effects.push(new Effect())
	}
}

export class ModuleRule extends Rule {
	slots: string = ''
	activation: string = ''
	duration: string = ''
	range: string = ''
	energy: number = 0

	override import(data: any) {
		super.import(data)

		this.slots = isString(data.slots) ? data.slots : ''
		this.activation = isString(data.activation) ? data.activation : ''
		this.duration = isString(data.duration) ? data.duration : ''
		this.range = isString(data.range) ? data.range : ''
		this.energy = Number.isInteger(data.energy) ? data.energy : 0
	}
}

export class DescriptiveRule extends Rule {
	important?: string
	cost?: number
	description: string = ''

	override import(data: any) {
		super.import(data)

		this.important = isString(data.important) ? data.important : ''
		this.cost = Number.isInteger(data.cost) ? data.cost : 0
		this.description = isString(data.description) ? data.description : ''
	}
}

export default class Equipment extends Entity {
	longName: boolean = false
	image: string = 'knife'
	level: string = 'standard'
	cost: number = 0
	type = 'Arme de contact standard'
	nicknames: string = ''
	summary: string = ''
	description: string = ''
	quote: string = ''
	author: string = ''
	extras: string[] = []
	rules: Rule[] = []

	constructor(data?: any) {
		super()

		if (data) {
			this.import(data)
		}
	}

	import(data: any) {
		this.longName = data.longName === true
		this.name = isString(data.name) ? data.name : ''
		this.image = isString(data.image) ? data.image : ''
		this.level = [STANDARD, ADVANCED, RARE, PRESTIGE, HOPE].includes(data.level?.toLowerCase?.()) ? data.level.toLowerCase() : STANDARD
		this.cost = Number.isInteger(data.cost) ? data.cost : 0
		this.type = isString(data.type) ? data.type : ''
		this.nicknames = isString(data.nicknames) ? data.nicknames : ''
		this.summary = isString(data.summary) ? data.summary : ''
		this.description = isString(data.description) ? data.description : ''
		this.quote = isString(data.quote) ? data.quote : ''
		this.author = isString(data.author) ? data.author : ''

		this.extras = []
		this.rules = []

		if (Array.isArray(data.extras)) {
			for (const extra of data.extras) {
				if (isString(extra)) {
					this.extras.push(extra)
				}
			}
		}

		if (Array.isArray(data.rules)) {
			for (const rule of data.rules) {
				if (rule.damage !== undefined || rule.violence !== undefined) {
					const attackRule = new AttackRule()
					attackRule.import(rule)
					this.rules.push(attackRule)
				} else if (rule.slots !== undefined || rule.activation !== undefined) {
					const moduleRule = new ModuleRule()
					moduleRule.import(rule)
					this.rules.push(moduleRule)
				} else if (rule.description !== undefined || rule.important !== undefined) {
					const descriptiveRule = new DescriptiveRule()
					descriptiveRule.import(rule)
					this.rules.push(descriptiveRule)
				} else if (rule.armor !== undefined || rule.speed !== undefined) {
					const droneRule = new DroneRule()
					droneRule.import(rule)
					this.rules.push(droneRule)
				}
			}
		}
	}

	newAttackRule() {
		this.rules.push(new AttackRule())
	}

	newModuleRule() {
		this.rules.push(new ModuleRule())
	}

	newDescriptiveRule() {
		this.rules.push(new DescriptiveRule())
	}

	newDroneRule() {
		this.rules.push(new DroneRule())
	}
}
