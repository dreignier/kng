import { ACHIEVEMENTS, ARCANAS, ARCHETYPES, ARMORS, ASPECTS_LABELS, CARACTERISTICS_LABELS, CRESTS, HEROIC_CAPACITIES, MODULES, SECTIONS, WEAPON_UPGRADES, WEAPONS } from '../constants'
import { fuc } from '../util'

export class ComputedCharacter {
	public armor = 0
	public energy = 0
	public forcefield = 0
	public ps = 0
	public hope = 0
	public perks: string[] = []
	public flaws: string[] = []
	public modules: string[] = []
	public weapons: string[] = []
	public errorAspects: string[] = []
	public errorCharacteristics: string[] = []
	public minimums: Map<{ name: string; value: number }, number> = new Map()
	public xp = 0
	public pg = 0
	public initiative = 0
	public defense = 0
	public reaction = 0

	incMinimum(key: { name: string; value: number }) {
		this.minimums.set(key, (this.minimums.get(key) || 0) + 1)
	}
}

export class Data {
	public archetypes: Archetype[] = []
	public achievements: Achievement[] = []
	public armors: Armor[] = []
	public weapons: Weapon[] = []
	public modules: Module[] = []
	public crests: string[] = []
	public sections: Section[] = []
	public arcanas: Arcana[] = []
	public perks: Perk[] = []
	public flaws: string[] = []
	public heroicCapacities: HeroicCapacity[] = []
	public upgrades: Upgrade[] = []
	public longbow!: Weapon
}

export class Character {
	public name = ''
	public aspects: Aspect[] = []
	public _archetype?: Archetype
	public _achievement?: Achievement
	public arcanas: (Arcana | undefined)[] = [undefined, undefined, undefined, undefined, undefined]
	public crest?: string
	public perks: (Perk | undefined)[] = [undefined, undefined]
	public _flaw?: string
	public _section?: Section
	public _armor?: Armor
	public weapons: (Weapon | undefined)[] = []
	public weaponUpgrades: (Upgrade | undefined)[][] = []
	public modules: (Module | undefined)[] = []
	public heroicCapacities: (HeroicCapacity | undefined)[] = []
	public computed = new ComputedCharacter()
	public data = new Data()

	constructor() {
		this.aspects = ASPECTS_LABELS.map(label => new Aspect(fuc(label)))

		this.aspects.forEach((aspect, index) => {
			for (const label of CARACTERISTICS_LABELS[index]) {
				aspect.characteristics.push(new Characteristic(fuc(label), aspect))
			}
		})

		this.data.crests = CRESTS

		this.data.modules = MODULES.map(data => {
			const [name, type, level, cost, ...slots] = data.split(' | ').map(value => value.trim())

			return new Module(name, type, Number(cost), fuc(level) as 'Standard' | 'Avancé' | 'Rare', slots.map(value => value.split(' ').map(value => Number(value))) || [])
		})

		for (const module of this.data.modules) {
			const match = /niv\. ([2-5])/.exec(module.name)
			if (match?.length) {
				const rank = Number(match[1])
				module.requirement = this.data.modules.find(({ name }) => name === module.name.replace('niv. ' + rank, 'niv. ' + (rank - 1)))
			}

			if (module.name.startsWith('Blindage amélioré')) {
				module.upgrade = { type: 'armor', value: 10 }
			} else if (module.name.startsWith('Champ de force amélioré')) {
				module.upgrade = { type: 'forcefield', value: 3 }
			} else if (module.name.startsWith('Énergie améliorée')) {
				module.upgrade = { type: 'energy', value: 10 }
			} else if (module.name.startsWith('Overdrive')) {
				const [, name] = module.name.split(' ')
				module.overdrive = this.characteristic(name)
			}
		}

		this.data.modules.sort((a, b) => a.name.localeCompare(b.name))

		this.data.upgrades = WEAPON_UPGRADES.map(data => {
			const [name, value] = data.split(' | ').map(value => value.trim())

			return new Upgrade(name, Number(value))
		})

		this.data.upgrades.sort((a, b) => a.name.localeCompare(b.name))

		this.data.weapons = WEAPONS.map(data => {
			const [name, level, cost, type, weight, upgrades] = data.split(' | ').map(value => value.trim())

			return new Weapon(
				name,
				type.toLowerCase() as 'contact' | 'distance',
				Number(cost), fuc(level) as 'Standard' | 'Avancé' | 'Rare',
				['une main', 'deux mains', 'lourde'].indexOf(weight) + 1,
				upgrades.split(', ').map(name => this.data.upgrades.find(upgrade => upgrade.name === name)!)
			)
		})

		this.data.longbow = this.data.weapons[this.data.weapons.length - 1]
		this.data.weapons.splice(this.data.weapons.length - 1, 1)
		this.data.weapons.sort((a, b) => a.name.localeCompare(b.name))

		this.data.sections = SECTIONS.map(data => {
			const [name, aspect, modules, flaw] = data.split(' | ').map(value => value.trim())

			return new Section(name, this.aspect(aspect), (modules || '').split(', ').map(name => this.data.modules.find(module => module.name === name)!), flaw)
		})

		this.data.archetypes = ARCHETYPES.map(data => {
			const [name, bonus] = data.split(' | ').map(value => value.trim())

			return new Archetype(name, bonus.split(', ').map(bonus => bonus.split(' OU ').map(value => this.characteristic(value)!)))
		})

		this.data.achievements = ACHIEVEMENTS.map(data => {
			const [name, aspects, requirements, forbiddens] = data.split(' | ').map(value => value.trim())

			return new Achievement(
				name,
				aspects.split(' OU ').map(name => this.aspect(name)!),
				requirements.split(' OU ').map(value => (this.aspect(value) || this.characteristic(value))!),
				(forbiddens || '').split(' ET ').map(name => this.data.archetypes.find(archetype => archetype.name === name)!)
			)
		})

		this.data.armors = ARMORS.map(data => {
			const [name, profile, slots, overdrives] = data.split(' | ').map(value => value.trim())
			const [armor, energy, forcefield] = profile.split(', ').map(value => Number(value))

			return new Armor(name, armor, forcefield, energy, overdrives.split(' ').map(value => this.characteristic(value)!), slots.split(' ').map(value => Number(value)))
		})

		this.data.arcanas = ARCANAS.map(data => {
			const [number, name, aspect, perk, flaw] = data.split(' | ').map(value => value.trim())

			return new Arcana(name, number, this.aspect(aspect), new Perk(perk), flaw)
		})

		this.data.heroicCapacities = HEROIC_CAPACITIES.map(data => {
			const [name, cost] = data.split(' | ').map(value => value.trim())

			return new HeroicCapacity(name, Number(cost))
		})

		this.filterModules()
		this.computeAspects()
	}

	characteristics() {
		return this.aspects.flatMap(aspect => aspect.characteristics)
	}

	generate() {

	}

	aspect(name: string) {
		if (!name) {
			return undefined
		}

		return this.aspects.find(aspect => aspect.name.toLowerCase() === name.toLowerCase())
	}

	characteristic(name: string) {
		if (!name) {
			return undefined
		}

		return this.characteristics().find(characteristic => characteristic.name.toLowerCase() === name.toLowerCase())
	}

	newWeapon() {
		this.weapons.push(undefined)
		this.weaponUpgrades.push([])
	}

	newModule() {
		this.modules.push(undefined)
	}

	newHeroicCapacity() {
		this.heroicCapacities.push(undefined)
	}

	get archetype() {
		return this._archetype!
	}

	set archetype(archetype: Archetype) {
		this._archetype = archetype

		this.filterAchievements()
		this.computeAspects()
	}

	get achievement() {
		return this._achievement!
	}

	set achievement(achievement: Achievement) {
		this._achievement = achievement

		this.filterArchetypes()
		this.computeAspects()
	}

	get section() {
		return this._section!
	}

	set section(section: Section) {
		this._section = section

		this.filterModules()
		this.computeAspects()
	}

	get armor() {
		return this._armor!
	}

	set armor(armor: Armor) {
		if (armor === this._armor) {
			return
		}

		this._armor = armor

		if (this.armor.name === 'Ranger') {
			this.weapons.unshift(undefined)
			this.weaponUpgrades.unshift([])
			this.setWeapon(0, this.data.longbow)
		} else {
			const index = this.weapons.indexOf(this.data.longbow)
			if (index !== -1) {
				this.removeWeapon(index)
			}
		}
	}

	get flaw() {
		return this._flaw!
	}

	set flaw(flaw: string) {
		this._flaw = flaw
	}

	setArcana(index: number, arcana: Arcana) {
		this.arcanas[index] = arcana

		this.filterArcanas()
		this.filterPerks()
		this.filterFlaws()
		this.computeAspects()
	}

	setAspect(aspect: Aspect, value: number) {
		aspect.value = value

		this.computeAspects()
	}

	setCharacteristic(characteristic: Characteristic, value: number) {
		characteristic.value = value

		this.computeAspects()
	}

	setModule(index: number, module: Module) {
		this.modules[index] = module

		this.filterModules()
	}

	setWeapon(index: number, weapon: Weapon | undefined) {
		this.weapons[index] = weapon
		this.weaponUpgrades[index] = []

		for (let i = 0; i < (weapon?.slots ?? 0); i++) {
			this.weaponUpgrades[index].push(undefined)
		}
	}

	setWeaponUpgrade(index: number, weapon: Weapon, upgrade: Upgrade) {
		this.weaponUpgrades[this.weapons.indexOf(weapon)][index] = upgrade
	}

	setPerk(index: number, perk: Perk) {
		this.perks[index] = perk

		this.filterPerks()
	}

	setHeroicCapacities(index: number, heroicCapacity: HeroicCapacity) {
		this.heroicCapacities[index] = heroicCapacity

		this.filterHeroicCapacities()
	}

	removeWeapon(index: number) {
		this.weapons.splice(index, 1)
		this.weaponUpgrades.splice(index, 1)
	}

	removeModule(index: number) {
		this.modules.splice(index, 1)
	}

	removeHeroicCapacity(index: number) {
		this.heroicCapacities.splice(index, 1)
	}

	filterArchetypes() {
		for (const archetype of this.data.archetypes) {
			archetype.available = this._achievement ? !this._achievement.forbiddens.includes(archetype) : true
		}
	}

	filterAchievements() {
		for (const achievement of this.data.achievements) {
			achievement.available = this._archetype ? !achievement.forbiddens.includes(this._archetype) : true
		}
	}

	filterHeroicCapacities() {
		for (const heroicCapacity of this.data.heroicCapacities) {
			heroicCapacity.available = !this.heroicCapacities.includes(heroicCapacity)
		}
	}

	filterArcanas() {
		for (const arcana of this.data.arcanas) {
			arcana.available = !this.arcanas.includes(arcana)
		}
	}

	filterPerks() {
		this.data.perks = this.arcanas.filter(arcana => arcana).map(arcana => arcana!.perk)

		for (let i = 0; i <= 1; ++i) {
			if (this.perks[i] && !this.data.perks.includes(this.perks[i]!)) {
				this.perks[i] = undefined
			}
		}
	}

	filterFlaws() {
		this.data.flaws = this.arcanas.filter(arcana => arcana).map(arcana => arcana!.flaw)

		if (this._flaw && !this.data.flaws.includes(this._flaw)) {
			this._flaw = undefined
		}
	}

	filterModules() {
		if (this._section) {
			for (let i = 0; i < this.modules.length; i++) {
				const module = this.modules[i]

				if (module && this._section.modules?.includes(module)) {
					this.modules[i] = undefined
				}
			}
		}

		let change = false
		do {
			change = false
			for (let i = 0; i < this.modules.length; i++) {
				const module = this.modules[i]

				if (!module) {
					continue
				}

				if (module.requirement && !this.modules.includes(module.requirement)) {
					this.modules[i] = undefined
					change = true
				}
			}
		} while (change)

		const currentModules = [...this.modules]

		if (this.section) {
			currentModules.push(...this.section.modules || [])
		}

		for (const module of this.data.modules) {
			module.available = !currentModules.includes(module)

			if (module.available && module.requirement) {
				module.available = currentModules.includes(module.requirement)
			}
		}
	}

	computeAspects() {
		for (const characteristic of this.characteristics()) {
			if (characteristic.value > characteristic.aspect.value) {
				characteristic.value  = characteristic.aspect.value
			}
		}

		const bonuses: { name: string; value: number; }[][] = []

		if (this._archetype) {
			bonuses.push(...this._archetype.bonus)
		}

		if (this._achievement) {
			bonuses.push(this._achievement.aspects)
		}

		if (this._section) {
			if (this._section.aspect) {
				bonuses.push([this._section.aspect])
			} else {
				for (let i = 0; i < 5; ++i) {
					bonuses.push(this.characteristics())
				}
			}
		}

		for (const arcana of this.arcanas) {
			if (arcana) {
				if (arcana.aspect) {
					bonuses.push([arcana.aspect])
					bonuses.push(arcana.aspect.characteristics)
				} else if (arcana.name === 'Le Fou') {
					for (let i = 0; i < 6; ++i) {
						bonuses.push(this.characteristics())
					}
				} else if (arcana.name === 'La Maison-Dieu') {
					for (let i = 0; i < 2; ++i) {
						bonuses.push(this.aspects)
					}
				}
			}
		}

		for (const aspect of this.aspects) {
			this.computed.minimums.set(aspect, 2)
			for (const characteristic of aspect.characteristics) {
				this.computed.minimums.set(characteristic, 1)
			}
		}

		const mixedMinimums: Record<string, { targets: { name: string; value: number }[]; amount: number }> = {}

		for (const bonus of bonuses) {
			if (bonus.length === 1) {
				this.computed.incMinimum(bonus[0])
			} else {
				const key = bonus.map(({ name }) => name).sort((a, b) => a.localeCompare(b)).join(' ')

				if (!mixedMinimums[key]) {
					mixedMinimums[key] = { targets: bonus, amount: 0 }
				}

				mixedMinimums[key].amount += 1
			}
		}

		for (const key of this.computed.minimums.keys()) {
			const min = this.computed.minimums.get(key)!
			if (key.value < min) {
				key.value = min
			}
		}

		this.computed.errorAspects = []
		this.computed.errorCharacteristics = []
		for (const { targets, amount } of Object.values(mixedMinimums)) {
			const totalMin = targets.map(t => this.computed.minimums.get(t)!).reduce((acc, min) => acc + min, 0) + amount
			const total = targets.map(t => t.value).reduce((acc, value) => acc + value, 0)

			if (total < totalMin) {
				for (const target of targets) {
					(target instanceof Aspect ? this.computed.errorAspects : this.computed.errorCharacteristics).push(target.name)
				}
			}
		}
	}
}

export class Aspect {
	public characteristics: Characteristic[] = []
	public value = 2

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
	public available = true

	constructor(
		public name: string,
		public bonus: Characteristic[][]
	) {}
}

export class Arcana {
	public available = true

	constructor(
		public name: string,
		public number: string,
		public aspect: Aspect | undefined,
		public perk: Perk,
		public flaw: string
	) {}
}

export class Achievement {
	public available = true

	constructor(
		public name: string,
		public aspects: Aspect[],
		public requirements: (Aspect | Characteristic)[],
		public forbiddens: Archetype[]
	) {}
}

export class Armor {
	constructor(
		public name: string,
		public armor: number,
		public forcefield: number,
		public energy: number,
		public overdrives: Characteristic[],
		public slots: number[]
	) {}
}

export class Weapon {
	constructor(
		public name: string,
		public type: 'contact' | 'distance',
		public cost: number,
		public level: 'Standard' | 'Avancé' | 'Rare',
		public slots: number,
		public upgrades: Upgrade[] = []
	) {}
}

export class Module {
	public available = true

	public requirement?: Module
	public upgrade?: { type: 'armor' | 'forcefield' | 'energy', value: number }
	public overdrive?: Characteristic

	constructor(
		public name: string,
		public type: string,
		public cost: number,
		public level: 'Standard' | 'Avancé' | 'Rare',
		public slots: number[][] = []
	) {}
}

export class Section {
	constructor(
		public name: string,
		public aspect?: Aspect,
		public modules?: Module[],
		public flaw?: string
	) {}
}

export class HeroicCapacity {
	public available = true

	constructor(
		public name: string,
		public cost: number
	) {}
}

export class Upgrade {
	constructor(
		public name: string,
		public cost: number
	) {}
}

export class Perk {
	constructor(
		public name: string
	) {}
}
