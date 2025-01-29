import { ASPECTS_LABELS, CARACTERISTICS_LABELS } from '../constants'

export class Character {
	public aspects: Aspect[] = []
	public characteristics: Characteristic[] = []
	public archetype?: Archetype
	public achievement?: Achievement
	public arcanas: Arcana[] = []
	public crest?: string
	public perks: string[] = []
	public flaws: string[] = []
	public section?: Section
	public armor?: Armor
	public weapons: Weapon[] = []
	public modules: Module[] = []

	constructor() {
		for (const label of ASPECTS_LABELS) {
			this.aspects.push(new Aspect(label))
		}

		this.aspects.forEach((aspect, index) => {
			for (const label of CARACTERISTICS_LABELS[index]) {
				aspect.characteristics.push(new Characteristic(label, aspect))
			}
		})
	}

	generate() {

	}
}

export class Aspect {
	public value = 2
	public characteristics: Characteristic[] = []

	constructor(
		public name: string
	) {}
}

export class Characteristic {
	public value = 1
	public overdrive = 0

	constructor(
		public name: string,
		public aspect: Aspect
	) {}
}

export class Archetype {
	constructor(
		public name: string,
		public bonus: Characteristic[][]
	) {}
}

export class Arcana {
	constructor(
		public name: string,
		public number: string,
		public aspect: Aspect | undefined,
		public perk: string,
		public flaw: string
	) {}
}

export class Achievement {
	constructor(
		public name: string,
		public aspects: Aspect[],
		public requirement: { value: number }
	) {}
}

export class Armor {
	constructor(
		public name: string,
		public armor: number,
		public forcefield: number,
		public energy: number,
		public overdrives: Characteristic[],
		public slots: Record<string, number>
	) {}
}

export class Weapon {
	constructor(
		public name: string,
		public type: 'contact' | 'distance',
		public cost: number,
		public level: 'standard' | 'advanced' | 'rare'
	) {}
}

export class Module {
	public requirement?: Module
	public upgrade?: { type: 'armor' | 'forcedfield' | 'energy', value: number }

	constructor(
		public name: string,
		public type: string,
		public cost: number,
		public level: 'standard' | 'advanced' | 'rare',
		public slots: Record<string, number>
	) {}
}

export class Section {
	constructor(
		public name: string,
		public aspect: Aspect,
		public modules: Module[],
		public flaw: string
	) {}
}
