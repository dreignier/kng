import { ACHIEVEMENTS, ARCANAS, ARCHETYPES, ARMORS, ASPECTS_LABELS, CARACTERISTICS_LABELS, CRESTS, HEROIC_CAPACITIES, MODULES, SECTIONS, WEAPON_UPGRADES, WEAPONS } from '../constants'
import { fuc } from '../util'

export class ComputedCharacter {
	public armor = 0
	public energy = 0
	public forcefield = 0
	public ps = 0
	public hope = 50
	public errors: { source: string, targets: string[]; value: number }[] = []
	public minimums: Map<{ name: string; value: number }, number> = new Map()
	public xp = 0
	public pg = 0
	public initiative = 0
	public defense = 0
	public reaction = 0
	public pgError = 0
	public availableLevels: ('Standard' | 'Avancé' | 'Rare')[] = ['Standard']

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
	public identity = ''
	public name = ''
	public description = ''
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
	public minorMotivations = ''
	public majorMotivation = ''
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
			const match = /niv\. ([1-9])/.exec(module.name)
			if (match?.length) {
				const rank = Number(match[1])
				const baseName = module.name.slice(0, -1)
				module.requirement = this.data.modules.find(({ name }) => name === baseName + (rank - 1))
				module.next = this.data.modules.find(({ name }) => name === baseName + (rank + 1))
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

			const weapon = new Weapon(
				name,
				type.toLowerCase() as 'contact' | 'distance',
				Number(cost), fuc(level) as 'Standard' | 'Avancé' | 'Rare',
				['une main', 'deux mains', 'lourde'].indexOf(weight) + 1,
				upgrades.split(', ').map(name => this.data.upgrades.find(upgrade => upgrade.name === name)!)
			)

			if (name === 'Fusil Longbow') {
				weapon.slots = 7
			}

			return weapon
		})

		this.data.longbow = this.data.weapons[this.data.weapons.length - 1]
		this.data.weapons.splice(this.data.weapons.length - 1, 1)
		this.data.weapons.sort((a, b) => a.name.localeCompare(b.name))

		this.data.sections = SECTIONS.map(data => {
			const [name, aspect, modules, flaw] = data.split(' | ').map(value => value.trim())

			return new Section(name, this.aspect(aspect), modules?.trim() ? modules.split(', ').map(name => this.data.modules.find(module => module.name === name)!) : undefined, flaw)
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
				forbiddens?.trim() ? forbiddens.split(' ET ').map(name => this.data.archetypes.find(archetype => archetype.name === name)!) : []
			)
		})

		this.data.armors = ARMORS.map(data => {
			const [name, profile, slots, overdrives] = data.split(' | ').map(value => value.trim())
			const [armor, energy, forcefield] = profile.split(' ').map(value => Number(value))

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

		this.computeAspects()
		this.computeDerived()
		this.computePGWeaponModules()
		this.filterAchievements()
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

		this.computePGWeaponModules()
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

		if (this._armor?.name === 'Ranger') {
			this.weapons.unshift(undefined)
			this.weaponUpgrades.unshift([])
			this.setWeapon(0, this.data.longbow)
		} else {
			const index = this.weapons.indexOf(this.data.longbow)
			if (index !== -1) {
				this.removeWeapon(index)
			}
		}

		this.computePGWeaponModules()
	}

	get flaw() {
		return this._flaw!
	}

	set flaw(flaw: string) {
		this._flaw = flaw

		this.computeDerived()
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

		this.computePGWeaponModules()
	}

	setWeapon(index: number, weapon: Weapon | undefined) {
		this.weapons[index] = weapon
		this.weaponUpgrades[index] = []

		for (let i = 0; i < (weapon?.slots ?? 0); i++) {
			this.weaponUpgrades[index].push(undefined)
		}

		this.computePGWeaponModules()
	}

	setWeaponUpgrade(index: number, weaponIndex: number, upgrade: Upgrade) {
		this.weaponUpgrades[weaponIndex][index] = upgrade

		this.computePGWeaponModules()
	}

	setPerk(index: number, perk: Perk) {
		this.perks[index] = perk

		this.filterPerks()
		this.computeDerived()
	}

	setHeroicCapacities(index: number, heroicCapacity: HeroicCapacity) {
		if (this.heroicCapacities[index]) {
			this.computed.xp -= this.heroicCapacities[index]!.cost
		}

		this.heroicCapacities[index] = heroicCapacity
		this.computed.xp += this.heroicCapacities[index]!.cost

		this.filterHeroicCapacities()
	}

	removeWeapon(index: number) {
		this.weapons.splice(index, 1)
		this.weaponUpgrades.splice(index, 1)

		this.computePGWeaponModules()
	}

	removeModule(index: number) {
		this.modules.splice(index, 1)

		this.computePGWeaponModules()
	}

	removeHeroicCapacity(index: number) {
		this.heroicCapacities.splice(index, 1)
	}

	weaponLabel(weapon: Weapon) {
		let result = weapon.name

		const upgrades = this.weaponUpgrades[this.weapons.indexOf(weapon)].filter(u => u)
		if (upgrades.length) {
			result += ' (' + upgrades.map(u => u!.name).join(', ') + ')'
		}

		return result
	}

	filterArchetypes() {
		for (const archetype of this.data.archetypes) {
			archetype.available = this._achievement ? !this._achievement.forbiddens.includes(archetype) : true
		}
	}

	filterAchievements() {
		for (const achievement of this.data.achievements) {
			achievement.available = (this._archetype ? !achievement.forbiddens.includes(this._archetype) : true) && achievement.requirements.some(r => r.value >= 4)
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

	filterWeapons() {
		for (const weapon of this.data.weapons) {
			weapon.available = this.computed.availableLevels.includes(weapon.level)
		}

		for (let i = 0; i < this.weapons.length; i++) {
			if (this.weapons[i] && !this.weapons[i]!.available) {
				this.weapons[i] = undefined
				this.weaponUpgrades[i] = []
			}
		}
	}

	filterModules() {
		const baseModules: Module[] = []
		if (this._section) {
			baseModules.push(...this._section.modules || [])
		}

		if (this._armor) {
			const modules = this._armor.overdrives.map(overdrive => this.data.modules.find(module => module.overdrive === overdrive)!)
			for (const module of modules) {
				baseModules.push(baseModules.includes(module) ? module.next! : module)
			}
		}

		for (let i = 0; i < this.modules.length; i++) {
			if (this.modules[i] && baseModules.includes(this.modules[i]!)) {
				this.modules[i] = undefined
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

				if (!this.computed.availableLevels.includes(module.level) || (module.requirement && !baseModules.includes(module.requirement) && !this.modules.includes(module.requirement))) {
					this.modules[i] = undefined
					change = true
				}
			}
		} while (change)

		const currentModules = [...baseModules, ...this.modules]

		for (const module of this.data.modules) {
			module.available = !currentModules.includes(module) && this.computed.availableLevels.includes(module.level)

			if (module.available && module.requirement) {
				module.available = currentModules.includes(module.requirement)
			}
		}

		for (const characteristic of this.characteristics()) {
			characteristic.overdrive = 0
		}

		for (const module of currentModules) {
			if (module?.overdrive) {
				module.overdrive.overdrive += 1
			}
		}

		this.computeDerived()
	}

	computeAspects() {
		for (const characteristic of this.characteristics()) {
			if (characteristic.value > characteristic.aspect.value) {
				characteristic.value  = characteristic.aspect.value
			}
		}

		const bonuses: { source: string; amount: number; targets: { name: string; value: number; }[] }[] = []

		if (this._archetype) {
			for (const bonus of this._archetype.bonus) {
				bonuses.push({ source: this._archetype.name, amount: 1, targets: bonus })
			}
		}

		const arcanas: Arcana[] = this.arcanas.filter(arcana => arcana) as Arcana[]
		arcanas.sort((a, b) => {
			if (a.name === 'Le Fou') {
				return +1
			} else if (a.name === 'La Maison-Dieu') {
				return -1
			}

			if (b.name === 'Le Fou') {
				return -1
			} else if (b.name === 'La Maison-Dieu') {
				return +1
			}

			return 0
		})

		for (const arcana of arcanas) {
			if (arcana) {
				if (arcana.aspect) {
					bonuses.push({ source: arcana.name, amount: 1, targets: [arcana.aspect] })
					bonuses.push({ source: arcana.name, amount: 3, targets: arcana.aspect.characteristics })
				} else if (arcana.name === 'Le Fou') {
					bonuses.push({ source: arcana.name, amount: 6, targets: this.characteristics() })
				} else if (arcana.name === 'La Maison-Dieu') {
					bonuses.push({ source: arcana.name, amount: 2, targets: this.aspects })
				}
			}
		}

		if (this._achievement) {
			bonuses.push({ source: this._achievement.name, amount: 1, targets: this._achievement.aspects })
		}

		if (this._section) {
			if (this._section.aspect) {
				bonuses.push({ source: this._section.name, amount: 1, targets: [this._section.aspect] })
			} else {
				bonuses.push({ source: 'Points libres', amount: 5, targets: this.characteristics() })
			}
		}

		for (const aspect of this.aspects) {
			this.computed.minimums.set(aspect, 2)
			for (const characteristic of aspect.characteristics) {
				this.computed.minimums.set(characteristic, 1)
			}
		}

		for (const bonus of bonuses) {
			if (bonus.targets.length === 1) {
				this.computed.incMinimum(bonus.targets[0])
			}
		}

		for (const key of this.computed.minimums.keys()) {
			const min = this.computed.minimums.get(key)!
			if (key.value < min) {
				key.value = min
			}
		}

		this.computed.errors = []

		const distributed = new Map<{ name: string; value: number }, number>()
		for (const aspect of this.aspects) {
			distributed.set(aspect, aspect.value - this.computed.minimums.get(aspect)!)

			for (const characteristic of aspect.characteristics) {
				distributed.set(characteristic, characteristic.value - this.computed.minimums.get(characteristic)!)
			}
		}

		const sortedDistributed = [...distributed.entries()].map(entry => ({ target: entry[0], value: entry[1] }))
		sortedDistributed.sort((a, b) => b.value - a.value)

		for (const bonus of bonuses.filter(b => b.targets.length > 1)) {
			for (const distribitued of sortedDistributed) {
				if (distribitued.value > 0 && bonus.targets.includes(distribitued.target)) {
					if (distribitued.value >= bonus.amount) {
						distribitued.value -= bonus.amount
						bonus.amount = 0
					} else {
						bonus.amount -= distribitued.value
						distribitued.value = 0
					}
				}
			}

			sortedDistributed.sort((a, b) => b.value - a.value)
		}

		for (const bonus of bonuses.filter(b => b.targets.length > 1 && b.amount > 0)) {
			this.computed.errors.push({ source: bonus.source, targets: bonus.targets.map(target => target.name), value: bonus.amount })
		}

		let xp = 0
		for (const distribitued of sortedDistributed) {
			let current = distribitued.target.value
			while (distribitued.value) {
				xp += current * ((distribitued.target instanceof Aspect) ? 5 : 2)
				distribitued.value -= 1
			}
		}

		for (const capacity of this.heroicCapacities) {
			if (capacity) {
				xp += capacity.cost
			}
		}

		this.computed.xp = xp

		this.computeDerived()
		this.filterAchievements()
	}

	computeDerived() {
		this.computed.defense = this.aspects[1].max()
		this.computed.reaction = this.aspects[2].max()
		this.computed.initiative = this.aspects[4].max()
		this.computed.ps = 10 + this.aspects[0].max(false) * 6

		if (this._armor) {
			this.computed.armor = this._armor.armor
			this.computed.forcefield = this._armor.forcefield
			this.computed.energy = this._armor.energy

			for (const module of this.modules) {
				if (module && module.upgrade) {
					this.computed[module.upgrade.type] += module.upgrade.value
				}
			}
		}
	}

	computePGWeaponModules() {
		let pg = this.computed.pg
		this.filterModules()
		this.filterWeapons()
		this.computePG()

		while (pg !== this.computed.pg) {
			pg = this.computed.pg
			this.filterModules()
			this.filterWeapons()
			this.computePG()
		}
	}

	computePG() {
		let sub: Record<'Standard' | 'Avancé' | 'Rare', number> = { Standard: 0, Avancé: 0, Rare: 0 }
		let total = 0

		for (const weapon of this.weapons) {
			if (weapon) {
				sub[weapon.level] += weapon.cost
				total += weapon.cost
			}
		}

		for (const upgrades of this.weaponUpgrades) {
			for (const upgrade of upgrades) {
				if (upgrade) {
					sub.Standard += upgrade.cost
					total += upgrade.cost
				}
			}
		}

		for (const module of this.modules) {
			if (module) {
				sub[module.level] += module.cost
				total += module.cost
			}
		}

		this.computed.pg = Math.max(0, total - Math.min(50, sub.Standard))
		this.computed.pgError = Math.max(0, 50 - sub.Standard)

		this.computed.availableLevels = ['Standard']
		if (sub.Standard >= 150) {
			this.computed.availableLevels.push('Avancé')
		}
		if ((sub.Standard + sub.Avancé) >= 350) {
			this.computed.availableLevels.push('Rare')
		}
	}
}

export class Aspect {
	public characteristics: Characteristic[] = []
	public value = 2

	constructor(
		public name: string
	) {}

	max(overdrive = true) {
		return Math.max(...this.characteristics.map(characteristic => characteristic.value + (overdrive ? characteristic.overdrive : 0)))
	}
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
	public available = true

	constructor(
		public name: string,
		public type: 'contact' | 'distance',
		public cost: number,
		public level: 'Standard' | 'Avancé' | 'Rare',
		public slots: number,
		public upgrades: Upgrade[] = []
	) {}

	isAvailable(upgrade: Upgrade, current: Upgrade | undefined, upgrades: (Upgrade | undefined)[]) {
		if (upgrade === current) {
			return true
		}

		const result = !upgrades.includes(upgrade)

		if (this.name === 'Fusil Longbow') {
			let standardUpgrades = 0
			for (const upgrade of upgrades) {
				if (upgrade && upgrade.cost < 50) {
					standardUpgrades += 1
				}
			}

			if (standardUpgrades >= 3 && upgrade.cost < 50) {
				return false
			}
		}

		return result
	}
}

export class Module {
	public available = true

	public requirement?: Module
	public next?: Module
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
