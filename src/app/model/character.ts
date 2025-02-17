import { last, sample } from 'lodash'
import {
	ACHIEVEMENTS,
	ALL_CARACTERISTICS_LABELS,
	ARCANAS,
	ARCHETYPES,
	ARMORS,
	ASPECTS_LABELS,
	CARACTERISTICS_LABELS,
	CRESTS,
	HEROIC_CAPACITIES,
	MODULES,
	SECTIONS,
	SLOTS_LABELS,
	WEAPON_UPGRADES,
	WEAPONS,
	XP_COST
} from '../constants'
import { fuc } from '../util'

export class ComputedCharacter {
	public armor = 0
	public energy = 0
	public forcefield = 0
	public ps = 0
	public hope = 50
	public errors: { source: string; targets: string[]; value: number }[] = []
	public xp = 0
	public pg = 0
	public initiative = 0
	public initiativeDices = 3
	public defense = 0
	public reaction = 0
	public pgError = 0
	public availableLevels: ('Standard' | 'Avancé' | 'Rare' | 'Prestige')[] = ['Standard']
	public historic: {
		source: string
		steps: { target: string; value: number; xp?: number }[]
	}[] = []
	public minimums = new Map<Value, number>()
	public slots = [0, 0, 0, 0, 0, 0]
	public slotsError: number[] = []
	public freePoints = 0
	public hasAutomatedTurret = false
	public hasShoulderTurret = false

	addHistoric(source: string, target: string, value: number, xp?: number) {
		let element = this.historic.find((element) => element.source === source)

		if (!element) {
			element = { source, steps: [] }
			this.historic.push(element)
		}

		element.steps.push({ target, value, xp })
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

	perk(name: string) {
		return this.arcanas.map((a) => a.perk).find((perk) => perk.name === name)
	}
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
	public automatedTurret?: number
	public shoulderTurret?: number
	public prestigeWeapons: { name: string; cost: number }[] = []
	public weaponUpgrades: (Upgrade | undefined)[][] = []
	public modules: (Module | undefined)[] = []
	public heroicCapacities: (HeroicCapacity | undefined)[] = []
	public minorMotivations = ''
	public majorMotivation = ''
	public archetypeName = ''
	public achievementName = ''
	public noSectionFlaw = false
	public _freePoints = 0
	public bgImage = ''
	public portraitImage = ''
	public portraitWidth = 0
	public portraitHeight = 0
	public color = '#f25a1e'
	public dark = true
	public _unlockedLevel?: 'Avancé' | 'Rare' | 'Prestige'
	public computed = new ComputedCharacter()
	public data = new Data()

	constructor() {
		this.aspects = ASPECTS_LABELS.map((label) => new Aspect(fuc(label)))

		this.aspects.forEach((aspect, index) => {
			for (const label of CARACTERISTICS_LABELS[index]) {
				aspect.characteristics.push(new Characteristic(fuc(label), aspect))
			}
		})

		this.data.crests = CRESTS

		this.data.modules = MODULES.map((data) => {
			const [name, type, level, cost, ...slots] = data.split(' | ').map((value) => value.trim())

			return new Module(name, type, Number(cost), fuc(level) as 'Standard' | 'Avancé' | 'Rare' | 'Prestige', slots.map((value) => value.split(' ').map((value) => Number(value))) || [])
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
			} else if (module.name === "Vivacité de l'aigle") {
				module.upgrade = { type: 'reaction', value: 4 }
			} else if (module.name === 'Splendeur du cerf') {
				module.upgrade = { type: 'defense', value: 3 }
			} else if (module.name === 'Longévité du corbeau') {
				module.upgrade = { type: 'energy', value: 20 }
			} else if (module.name === 'Aura du dragon') {
				module.upgrade = { type: 'forcefield', value: 3 }
			} else if (module.name === 'Grandeur du dragon') {
				module.upgrade = { type: 'armor', value: 10 }
			} else if (module.name === 'Réflexes du serpent') {
				module.upgrade = { type: 'initiative', value: 10 }
			} else if (module.name.startsWith('Overdrive')) {
				const [, name] = module.name.split(' ')
				module.overdrive = this.characteristic(name)
			}
		}

		this.data.modules.sort((a, b) => a.name.localeCompare(b.name))

		this.data.upgrades = WEAPON_UPGRADES.map((data) => {
			const [name, value, ornementale] = data.split(' | ').map((value) => value.trim())

			return new Upgrade(name, Number(value), !!ornementale)
		})

		this.data.upgrades.sort((a, b) => a.name.localeCompare(b.name))

		this.data.weapons = WEAPONS.map((data) => {
			const [name, level, cost, type, weight, upgrades] = data.split(' | ').map((value) => value.trim())

			const weapon = new Weapon(
				name,
				type.toLowerCase() as 'contact' | 'distance',
				Number(cost),
				fuc(level) as 'Standard' | 'Avancé' | 'Rare' | 'Prestige',
				['une main', 'deux mains', 'lourde'].indexOf(weight) + 1,
				upgrades.split(', ').map((name) => this.data.upgrades.find((upgrade) => upgrade.name === name)!)
			)

			if (name === 'Fusil Longbow') {
				weapon.slots = 7
			}

			return weapon
		})

		this.data.longbow = this.data.weapons[this.data.weapons.length - 1]
		this.data.weapons.splice(this.data.weapons.length - 1, 1)
		this.data.weapons.sort((a, b) => a.name.localeCompare(b.name))

		this.data.sections = SECTIONS.map((data) => {
			const [name, aspect, modules, flaw] = data.split(' | ').map((value) => value.trim())

			return new Section(name, this.aspect(aspect), modules?.trim() ? modules.split(', ').map((name) => this.data.modules.find((module) => module.name === name)!) : undefined, flaw)
		})

		this.data.archetypes = ARCHETYPES.map((data) => {
			const [name, bonus] = data.split(' | ').map((value) => value.trim())

			return new Archetype(
				name,
				bonus.split(', ').map((bonus) => bonus.split(' OU ').map((value) => this.characteristic(value)!))
			)
		})

		this.data.achievements = ACHIEVEMENTS.map((data) => {
			const [name, aspects, requirements, forbiddens] = data.split(' | ').map((value) => value.trim())

			return new Achievement(
				name,
				aspects.split(' OU ').map((name) => this.aspect(name)!),
				requirements?.trim() ? requirements.split(' OU ').map((value) => (this.aspect(value) || this.characteristic(value))!) : [],
				forbiddens?.trim() ? forbiddens.split(' ET ').map((name) => this.data.archetypes.find((archetype) => archetype.name === name)!) : []
			)
		})

		this.data.armors = ARMORS.map((data) => {
			const [name, profile, slots, overdrives] = data.split(' | ').map((value) => value.trim())
			const [armor, energy, forcefield] = profile.split(' ').map((value) => Number(value))

			return new Armor(
				name,
				armor,
				forcefield,
				energy,
				overdrives.split(' ').map((value) => this.characteristic(value)!),
				slots.split(' ').map((value) => Number(value))
			)
		})

		this.data.arcanas = ARCANAS.map((data) => {
			const [number, name, aspect, perk, flaw] = data.split(' | ').map((value) => value.trim())

			return new Arcana(name, number, this.aspect(aspect), new Perk(perk), flaw)
		})

		this.data.heroicCapacities = HEROIC_CAPACITIES.map((data) => {
			const [name, cost] = data.split(' | ').map((value) => value.trim())

			return new HeroicCapacity(name, Number(cost))
		})

		this.computeAspects()
		this.computeDerived()
		this.computePGWeaponModules()
		this.filterAchievements()
	}

	export() {
		const result: any = {
			identity: this.identity,
			name: this.name,
			description: this.description,
			aspects: this.aspects.map((aspect) => ({
				name: aspect.name,
				value: aspect.value,
				characteristics: aspect.characteristics.map((characteristic) => ({
					name: characteristic.name,
					value: characteristic.value
				}))
			})),
			archetype: this._archetype?.name,
			achievement: this._achievement?.name,
			arcanas: this.arcanas.map((arcana) => arcana?.name),
			crest: this.crest,
			perks: this.perks.map((perk) => perk?.name),
			flaw: this._flaw,
			section: this._section?.name,
			armor: this._armor?.name,
			weapons: this.weapons.map((weapon) => weapon?.name),
			weaponUpgrades: this.weaponUpgrades.map((upgrades) => upgrades.map((upgrade) => upgrade?.name)),
			modules: this.modules.map((module) => module?.name),
			heroicCapacities: this.heroicCapacities.map((capacity) => capacity?.name),
			minorMotivations: this.minorMotivations,
			majorMotivation: this.majorMotivation,
			archetypeName: this.archetypeName,
			achievementName: this.achievementName,
			noSectionFlaw: this.noSectionFlaw,
			freePoints: this._freePoints || 0,
			bgImage: this.bgImage,
			portraitImage: this.portraitImage,
			color: this.color,
			dark: this.dark,
			prestigeWeapons: this.prestigeWeapons,
			automatedTurret: this.automatedTurret,
			shouldedTurret: this.shoulderTurret,
			unlockedLevel: this._unlockedLevel
		}

		return result
	}

	import(data: any) {
		this.identity = data.identity
		this.name = data.name
		this.description = data.description

		for (let i = 0; i < this.aspects.length; i++) {
			this.aspects[i].value = data.aspects[i].value

			for (let j = 0; j < this.aspects[i].characteristics.length; j++) {
				this.aspects[i].characteristics[j].value = data.aspects[i].characteristics[j].value
			}
		}

		this._archetype = this.data.archetypes.find((archetype) => archetype.name === data.archetype)
		this._achievement = this.data.achievements.find((achievement) => achievement.name === data.achievement)
		this.arcanas = data.arcanas.map((name: string) => this.data.arcanas.find((arcana) => arcana.name === name))
		this.crest = data.crest
		this._flaw = data.flaw
		this._section = this.data.sections.find((section) => section.name === data.section)
		this._armor = this.data.armors.find((armor) => armor.name === data.armor)
		this.weapons = data.weapons.map((name: string) => this.data.weapons.find((weapon) => weapon.name === name))
		this.weaponUpgrades = data.weaponUpgrades.map((upgrades: string[]) => upgrades.map((name: string) => this.data.upgrades.find((upgrade) => upgrade.name === name)))
		this.modules = data.modules.map((name: string) => this.data.modules.find((module) => module.name === name))
		this.heroicCapacities = data.heroicCapacities.map((name: string) => this.data.heroicCapacities.find((capacity) => capacity.name === name))
		this.minorMotivations = data.minorMotivations
		this.majorMotivation = data.majorMotivation
		this.archetypeName = data.archetypeName
		this.achievementName = data.achievementName
		this.noSectionFlaw = !!data.noSectionFlaw
		this._freePoints = data.freePoints || 0
		this.bgImage = data.bgImage || ''
		this.portraitImage = data.portraitImage || ''
		this.color = data.color || '#f25a1e'
		this.dark = data.dark !== undefined ? !!data.dark : true
		this.prestigeWeapons = data.prestigeWeapons || []
		this.automatedTurret = data.automatedTurret
		this.shoulderTurret = data.shoulderTurret
		this._unlockedLevel = data.unlockedLevel

		this.computeAspects()
		this.computePGWeaponModules()
		this.filterAchievements()
		this.filterArcanas()
		this.filterPerks()
		this.filterFlaws()
		this.computeDerived()

		this.perks = data.perks.map((name: string) => this.data.perks.find((perk) => perk.name === name))
	}

	achievementLabel() {
		if (!this._achievement) {
			return ''
		}

		if (this._achievement.name === 'Haut fait personnalisé' && this.achievementName.trim()) {
			return this.achievementName
		}

		return this._achievement.name
	}

	archetypeLabel() {
		if (!this._archetype) {
			return ''
		}

		if (this._archetype.name === 'Archétype libre' && this.archetypeName.trim()) {
			return this.archetypeName
		}

		return this._archetype.name
	}

	clone() {
		const character = new Character()
		character.import(this.export())

		return character
	}

	characteristics() {
		return this.aspects.flatMap((aspect) => aspect.characteristics)
	}

	errorAspects() {
		const result: Aspect[] = []

		for (const errors of this.computed.errors) {
			for (const name of errors.targets) {
				const aspect = this.aspect(name)
				if (aspect && !result.includes(aspect) && aspect.value < this.maxAspect(aspect)) {
					result.push(aspect)
				}
			}
		}

		return result
	}

	weaponTurretState(index: number) {
		if (this.automatedTurret === index) {
			return 1
		}

		if (this.shoulderTurret === index) {
			return 2
		}

		return 0
	}

	setWeaponTurretState(index: number, state: number) {
		if (state === 1) {
			this.automatedTurret = index
		}

		if (state === 2) {
			this.shoulderTurret = index
		}

		if (state === 0) {
			if (this.automatedTurret === index) {
				this.automatedTurret = undefined
			}

			if (this.shoulderTurret === index) {
				this.shoulderTurret = undefined
			}
		}
	}

	errorCharacteristics() {
		const result: Characteristic[] = []

		for (const errors of this.computed.errors) {
			for (const name of errors.targets) {
				const characteristic = this.characteristic(name)
				if (characteristic && !result.includes(characteristic) && characteristic.value < characteristic.aspect.value) {
					result.push(characteristic)
				}
			}
		}

		return result
	}

	dispatchAspectPoints(options: GenerateOptions) {
		let aspects = this.errorAspects()
		while (aspects.length) {
			const aspect = options.chooseAspect(aspects) || sample(aspects)!
			this.setAspect(aspect, aspect.value + 1)
			aspects = this.errorAspects()
		}
	}

	dispatchCharacteristicsPoints(options: GenerateOptions) {
		let characteristics = this.errorCharacteristics()
		while (characteristics.length) {
			const characteristic = options.chooseCharacteristic(characteristics) || sample(characteristics)!
			this.setCharacteristic(characteristic, characteristic.value + 1)
			characteristics = this.errorCharacteristics()
		}
	}

	generate(options: GenerateOptions) {
		// Archetype
		if (!this._archetype) {
			const archetypes = options.filterArchetypes(this.data.archetypes.filter((archetype) => archetype.available && archetype.name !== 'Archétype libre'))
			this.archetype = sample(archetypes)!
		}

		// Arcanas
		for (let i = 0; i < this.arcanas.length; i++) {
			if (!this.arcanas[i]) {
				const arcanas = this.data.arcanas.filter((arcana) => arcana.available)
				this.setArcana(i, sample(arcanas)!)
			}
		}

		this.dispatchAspectPoints(options)
		this.dispatchCharacteristicsPoints(options)

		// Perks
		for (let i = 0; i < this.perks.length; i++) {
			if (!this.perks[i]) {
				let perk = sample(this.data.perks)!
				do {
					perk = sample(this.data.perks)!
				} while (this.perks.includes(perk))

				this.setPerk(i, perk)
			}
		}

		// Flaw
		if (!this._flaw) {
			this.flaw = sample(this.data.flaws)!
		}

		// Achievement
		if (!this._achievement) {
			const achievements = options.filterAchievements(this.data.achievements.filter((achievement) => achievement.available && achievement.name !== 'Haut fait personnalisé'))

			if (achievements.length) {
				this.achievement = sample(achievements)!
			} else {
				this.achievement = this.data.achievements.find((achievement) => achievement.name === 'Haut fait personnalisé')!
			}
		}

		// Armor
		if (!this._armor) {
			this.armor = sample(this.data.armors)!
		}

		// Section
		if (!this._section) {
			const sections = options.filterSections(this.data.sections)
			const section = sample(sections)!

			this.section = section
		}

		this.dispatchAspectPoints(options)
		this.dispatchCharacteristicsPoints(options)

		// Crest
		if (!this.crest) {
			this.crest = sample(this.data.crests)!
		}

		const bannedModules: Module[] = []

		// Weapons, modules, upgrades
		while (this.computed.pgError || this.computed.pg < options.pg) {
			const availablePg = this.computed.pgError || options.pg - this.computed.pg

			const weapons = options.filterWeapons(
				this.data.weapons.filter((w) => {
					if (!w.available || w.cost > availablePg) {
						return false
					}

					if (this.weapons.filter((weapon) => weapon === w).length >= (w.slots === 1 ? 2 : 1)) {
						return false
					}

					return true
				})
			)

			const modules = options.filterModules(this.data.modules.filter((module) => module.available && module.cost <= availablePg && !bannedModules.includes(module)))
			const upgrades: {
				weaponIndex: number
				upgradeIndex: number
				upgrade: Upgrade
			}[] = []

			if (options.weaponUpgrades) {
				for (let i = 0; i < this.weapons.length; ++i) {
					const weapon = this.weapons[i]
					if (weapon) {
						for (let j = 0; j < this.weaponUpgrades[i].length; ++j) {
							const upgrade = this.weaponUpgrades[i][j]
							if (!upgrade) {
								for (const upgrade of weapon.upgrades) {
									if (!upgrade.ornementale && upgrade.cost <= availablePg && weapon.isAvailable(upgrade, undefined, this.weaponUpgrades[i])) {
										upgrades.push({ weaponIndex: i, upgradeIndex: j, upgrade })
									}
								}

								break
							}
						}
					}
				}
			}

			const randomUpgrade = () => {
				const upgrade = sample(upgrades)!
				this.setWeaponUpgrade(upgrade.upgradeIndex, upgrade.weaponIndex, upgrade.upgrade)
			}
			const randomWeapon = () => {
				this.newWeapon()
				this.setWeapon(this.weapons.length - 1, sample(weapons)!)
			}
			const randomModule = () => {
				this.newModule()
				this.setModule(this.modules.length - 1, sample(modules)!)
			}

			const possibilities: (() => void)[] = []
			if (weapons.length) {
				possibilities.push(randomWeapon)
			}
			if (modules.length) {
				possibilities.push(randomModule)
			}
			if (upgrades.length) {
				possibilities.push(randomUpgrade)
			}

			if (possibilities.length) {
				sample(possibilities)!()
			} else if (this.computed.pgError && options.pg) {
				this.computed.pgError = 0
			} else {
				break
			}

			if (this.computed.slotsError.length) {
				// Last module can't fit. Remove it and ban it
				bannedModules.push(this.modules[this.modules.length - 1]!)
				this.removeModule(this.modules.length - 1)
			}
		}

		while (this.computed.xp < options.xp) {
			const availableXp = options.xp - this.computed.xp

			let possibilities: { target: Value; cost: number }[] = []

			for (const aspect of this.aspects) {
				if (aspect.value < this.maxAspect(aspect)) {
					possibilities.push({ target: aspect, cost: aspect.value * 5 })
				}

				for (const characteristic of aspect.characteristics) {
					if (characteristic.value < aspect.value) {
						possibilities.push({
							target: characteristic,
							cost: characteristic.value * 2
						})
					}
				}
			}

			possibilities = possibilities.filter((p) => p.cost <= availableXp)
			while (possibilities.length) {
				const target = options.chooseForXp(possibilities) || sample(possibilities)!

				if (target.target instanceof Aspect) {
					this.setAspect(target.target, target.target.value + 1)
				} else {
					this.setCharacteristic(target.target as Characteristic, target.target.value + 1)
				}

				if (this.computed.xp > options.xp) {
					if (target.target instanceof Aspect) {
						this.setAspect(target.target, target.target.value - 1)
					} else {
						this.setCharacteristic(target.target as Characteristic, target.target.value - 1)
					}

					possibilities = possibilities.filter((p) => p !== target)
				} else {
					break
				}
			}

			if (!possibilities.length) {
				break
			}
		}
	}

	maxAspect(aspect: Aspect) {
		if (aspect.name === 'Machine' && this._flaw === 'Brute') {
			return 5
		}

		return this._flaw === 'Vétéran' ? 7 : 9
	}

	aspect(name: string) {
		if (!name) {
			return undefined
		}

		return this.aspects.find((aspect) => aspect.name.toLowerCase() === name.toLowerCase())
	}

	characteristic(name: string) {
		if (!name) {
			return undefined
		}

		return this.characteristics().find((characteristic) => characteristic.name.toLowerCase() === name.toLowerCase())
	}

	newWeapon() {
		this.weapons.push(undefined)
		this.weaponUpgrades.push([])
	}

	newPrestigeWeapon() {
		this.prestigeWeapons.push({ name: '', cost: 0 })
	}

	setPrestigeWeaponCost(weapon: { name: string; cost: number }, cost: number) {
		weapon.cost = cost

		this.computePGWeaponModules()
	}

	newModule() {
		this.modules.push(undefined)
	}

	newHeroicCapacity() {
		this.heroicCapacities.push(undefined)
	}

	set unlockedLevel(level: undefined | 'Avancé' | 'Rare' | 'Prestige') {
		this._unlockedLevel = level

		this.computePGWeaponModules()
	}

	get unlockedLevel() {
		return this._unlockedLevel
	}

	set freePoints(points: number) {
		points = Math.min(15, Math.max(0, points))

		this._freePoints = points

		this.computeAspects()
	}

	get freePoints() {
		return this._freePoints
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
		this.computeAspects()
	}

	removeWeapon(index: number) {
		this.weapons.splice(index, 1)
		this.weaponUpgrades.splice(index, 1)

		this.computePGWeaponModules()
	}

	removePrestigeWeapon(index: number) {
		this.prestigeWeapons.splice(index, 1)

		this.computePGWeaponModules()
	}

	removeModule(index: number) {
		this.modules.splice(index, 1)

		this.computePGWeaponModules()
	}

	removeHeroicCapacity(index: number) {
		this.heroicCapacities.splice(index, 1)
	}

	weaponLabel(index: number, weapon?: Weapon) {
		if (!weapon) {
			return ''
		}

		let result = weapon.name

		if (this.automatedTurret === index) {
			result += ' en tourelle automatisée'
		} else if (this.shoulderTurret === index) {
			result += ' en tourelle épaule'
		}

		const upgrades = this.weaponUpgrades[this.weapons.indexOf(weapon)].filter((u) => u)
		if (upgrades.length) {
			result += ' (' + upgrades.map((u) => u!.name).join(', ') + ')'
		}

		return result
	}

	prestigeWeaponLabel(weapon: { name: string; cost: number }, index: number) {
		let result = weapon.name

		if (this.automatedTurret === index) {
			result += ' (En tourelle automatisée)'
		} else if (this.shoulderTurret === index) {
			result += ' (En tourelle épaule)'
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
			achievement.available = (this._archetype ? !achievement.forbiddens.includes(this._archetype) : true) && (!achievement.requirements.length || achievement.requirements.some((r) => r.value >= 4))
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
		this.data.perks = this.arcanas.filter((arcana) => arcana).map((arcana) => arcana!.perk)

		for (let i = 0; i <= 1; ++i) {
			if (this.perks[i] && !this.data.perks.includes(this.perks[i]!)) {
				this.perks[i] = undefined
			}
		}
	}

	filterFlaws() {
		this.data.flaws = this.arcanas.filter((arcana) => arcana).map((arcana) => arcana!.flaw)

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

	isModuleAvailable(module: Module, baseModules: Module[], currentModules: (Module | undefined)[]) {
		if (baseModules.includes(module)) {
			return false
		}

		if (!this.computed.availableLevels.includes(module.level)) {
			return false
		}

		if (module.requirement && !currentModules.concat(baseModules).includes(module.requirement)) {
			return false
		}

		if (this._armor?.name === 'Paladin' && this.computed.pg < 250 && /(saut |course |déplacement silencieux )/i.test(module.name)) {
			return false
		}

		return true
	}

	filterModules() {
		const baseModules: Module[] = []
		if (this._section) {
			baseModules.push(...(this._section.modules || []))
		}

		if (this._armor) {
			const modules = this._armor.overdrives.map((overdrive) => this.data.modules.find((module) => module.overdrive === overdrive)!)
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

				if (!this.isModuleAvailable(module, baseModules, this.modules)) {
					this.modules[i] = undefined
					change = true
				}
			}
		} while (change)

		for (const module of this.data.modules) {
			module.available = this.isModuleAvailable(module, baseModules, this.modules) && !this.modules.includes(module)
		}

		for (const characteristic of this.characteristics()) {
			characteristic.overdrive = 0
		}

		for (const module of this.modules.concat(baseModules)) {
			if (module?.overdrive) {
				module.overdrive.overdrive += 1
			}
		}

		this.computeDerived()
	}

	computeAspects() {
		this.computed.errors = []
		this.computed.historic = []
		this.computed.xp = 0

		const bonuses: {
			source: string
			targets: Value[]
			value: number
			distinct?: boolean
			maxValue?: number
		}[] = []
		const newBonus = (source: string, targets: Value[], value: number, distinct?: boolean, maxValue?: number) => bonuses.push({ source, targets, value, distinct, maxValue })

		if (this._archetype) {
			for (const bonus of this._archetype.bonus) {
				newBonus(this._archetype.name, bonus, 1)
			}
		}

		for (const arcana of this.arcanas) {
			if (arcana) {
				if (arcana.aspect) {
					newBonus(arcana.name, [arcana.aspect], 1)
					newBonus(arcana.name, arcana.aspect.characteristics, 3)
				} else if (arcana.name === 'Le Fou') {
					newBonus(arcana.name, this.characteristics(), 6)
				} else if (arcana.name === 'La Maison-Dieu') {
					newBonus(arcana.name, this.aspects, 2)
				}
			}
		}

		if (this._freePoints) {
			newBonus('Points libres', this.characteristics(), this._freePoints, true, 4)
		}

		if (this._achievement) {
			newBonus(this._achievement.name, this._achievement.aspects, 1)
		}

		if (this._section?.aspect) {
			if (this._section.aspect) {
				newBonus(this._section.name, [this._section.aspect], 1)
			}
		}

		for (const aspect of this.aspects) {
			this.computed.minimums.set(aspect, 2)

			for (const characteristic of aspect.characteristics) {
				this.computed.minimums.set(characteristic, 1)
			}
		}

		// Make sure unique bonuses and minimums are applied
		for (const bonus of bonuses) {
			if (bonus.targets.length === 1) {
				const target = bonus.targets[0]
				const minimum = this.computed.minimums.get(target)! + bonus.value
				this.computed.minimums.set(target, minimum)
				target.value = Math.max(target.value, minimum)
			}
		}
		for (const characteristic of this.characteristics()) {
			if (characteristic.value > characteristic.aspect.value) {
				characteristic.value = characteristic.aspect.value
			}
		}

		const virtuals = new Map<Value, number>()
		const bonusHistoric: {
			bonus: {
				source: string
				targets: Value[]
				value: number
				distinct?: boolean
				maxValue?: number
			}
			targets: Value[]
		}[] = []

		const addHistoric = (
			bonus: {
				source: string
				targets: Value[]
				value: number
				distinct?: boolean
				maxValue?: number
			},
			target: Value,
			value: number
		) => {
			let element = bonusHistoric.find((element) => element.bonus === bonus)

			if (!element) {
				element = { bonus, targets: [] }
				bonusHistoric.push(element)
			}

			for (let i = 0; i < value; ++i) {
				element.targets.push(target)
			}
		}
		const incVirtual = (target: Value, value: number) => {
			virtuals.set(target, virtuals.get(target)! + value)
		}
		const getAvailable = (target: Value) => {
			const virtual = virtuals.get(target)!

			if (target instanceof Aspect) {
				return target.value - virtual
			}

			return Math.min(target.value - virtual, virtuals.get((target as Characteristic).aspect)! - virtual)
		}
		const sortTargets = (targets: Value[]) => {
			return [...targets].sort((a, b) => b.value - a.value)
		}

		for (const aspect of this.aspects) {
			virtuals.set(aspect, 2)
			for (const characteristic of aspect.characteristics) {
				virtuals.set(characteristic, 1)
			}
		}

		const impossibles = []

		for (const bonus of bonuses) {
			let value = bonus.value

			for (const target of sortTargets(bonus.targets)) {
				if (bonus.maxValue && virtuals.get(target)! > bonus.maxValue) {
					continue
				}

				let available = getAvailable(target)

				if (available) {
					available = Math.min(available, value)

					if (bonus.distinct) {
						available = 1
					}

					incVirtual(target, available)
					addHistoric(bonus, target, available)

					value -= available
				}

				if (!value) {
					break
				}
			}

			// Try to switch with a previous bonus
			while (value) {
				let before = value

				for (const target of bonus.targets) {
					if (bonus.maxValue && virtuals.get(target)! > bonus.maxValue) {
						continue
					}

					for (const historic of bonusHistoric) {
						if (historic.targets.length === 1 || historic.bonus === bonus || !historic.targets.includes(target) || historic.bonus.distinct) {
							continue
						}

						for (const otherTarget of sortTargets(historic.bonus.targets)) {
							if (otherTarget === target) {
								continue
							}

							const available = getAvailable(otherTarget)
							if (available) {
								// Move one point to this target
								incVirtual(otherTarget, 1)
								historic.targets.splice(historic.targets.indexOf(target), 1)
								historic.targets.push(otherTarget)

								addHistoric(bonus, target, 1)

								value -= 1
								break
							}
						}

						if (!value) {
							break
						}
					}

					if (!value) {
						break
					}
				}

				if (before === value) {
					break
				}
			}

			if (value) {
				const targets = bonus.distinct ? bonus.targets.filter((t) => !last(bonusHistoric)?.targets.includes(t) && (!(t instanceof Characteristic) || t.value < t.aspect.value)) : bonus.targets

				if (targets.length) {
					this.computed.errors.push({
						source: bonus.source,
						targets: targets.map((t) => t.name),
						value
					})
				} else {
					impossibles.push({ source: bonus.source, value })
				}
			}
		}

		// TODO affinage pour minimiser l'expérience

		for (const historic of bonusHistoric) {
			const values = new Map<Value, number>()
			for (const target of historic.targets) {
				values.set(target, (values.get(target) || 0) + 1)
			}

			for (const [target, value] of values) {
				this.computed.addHistoric(historic.bonus.source, target.name, value)
			}

			if (historic.bonus.source === 'Points libres') {
				this.computed.freePoints = historic.targets.length
			}
		}

		for (const impossible of impossibles) {
			this.computed.addHistoric(impossible.source, 'Impossible à dépenser', impossible.value)
		}

		for (const target of (this.aspects as (Aspect | Characteristic)[]).concat(this.characteristics())) {
			const overflow = target.value - virtuals.get(target)!
			if (overflow) {
				const cost = XP_COST[target.value - overflow][target.value] * (target instanceof Aspect ? 5 : 2)
				this.computed.xp += cost
				this.computed.addHistoric('Expérience', target.name, overflow, cost)
			}
		}

		for (const capacity of this.heroicCapacities) {
			if (capacity) {
				this.computed.xp += capacity.cost
				this.computed.addHistoric('Expérience', capacity.name, 0, capacity.cost)
			}
		}

		for (const historic of this.computed.historic) {
			historic.steps.sort((a, b) => {
				let aIndex = ASPECTS_LABELS.indexOf(a.target)
				if (aIndex === -1) {
					aIndex = ALL_CARACTERISTICS_LABELS.indexOf(a.target)
				}

				let bIndex = ASPECTS_LABELS.indexOf(b.target)
				if (bIndex === -1) {
					bIndex = ALL_CARACTERISTICS_LABELS.indexOf(b.target)
				}

				return aIndex - bIndex
			})
		}

		this.computeDerived()
		this.filterAchievements()
	}

	hasPerk(name: string) {
		return this.perks.includes(this.data.perk(name))
	}

	getCharacteristic(name: string) {
		return this.characteristic(name)?.value || 0
	}

	getOverdrive(name: string) {
		return this.characteristic(name)?.overdrive || 0
	}

	hasOverdrive(name: string, rank: number) {
		return this.getOverdrive(name) >= rank
	}

	computeDerived() {
		this.computed.defense = this.aspects[1].max()
		this.computed.reaction = this.aspects[2].max()
		this.computed.initiative = this.aspects[4].max()
		this.computed.ps = 10 + this.aspects[0].max(false) * 6
		this.computed.hope = 50
		this.computed.initiativeDices = 3

		if (this._armor) {
			this.computed.armor = this._armor.armor
			this.computed.forcefield = this._armor.forcefield
			this.computed.energy = this._armor.energy

			for (const module of this.modules) {
				if (module && module.upgrade) {
					;(this.computed[module.upgrade.type as keyof ComputedCharacter] as number) += module.upgrade.value
				}
			}
		}

		if (this.hasPerk('Forteresse spirituelle')) {
			this.computed.hope += 5
		}

		if (this.hasPerk('Dur à cuir')) {
			this.computed.ps += 5
		}

		if (this._flaw === 'Trop prudent') {
			this.computed.initiativeDices -= 1
		}

		if (this.hasOverdrive('Endurance', 3)) {
			this.computed.ps += 6
		}

		const instinctOd = this.getOverdrive('Instinct')
		if (instinctOd >= 3) {
			this.computed.initiative += instinctOd * 3
		}

		if (this.hasOverdrive('Aura', 5)) {
			this.computed.defense += this.getCharacteristic('Aura')
		}

		if (this.hasOverdrive('Dextérité', 5)) {
			this.computed.reaction = Math.max(this.computed.reaction, this.computed.defense)
		}

		if (this.modules.find((module) => module?.name === 'Vigueur du taureau')) {
			this.computed.ps *= 1.5
		}
	}

	computePGWeaponModules() {
		this.computePG()

		let pg = this.computed.pg || 0

		this.filterModules()
		this.filterWeapons()
		this.computePG()
		this.computeSlots()

		while (pg !== this.computed.pg) {
			pg = this.computed.pg
			this.filterModules()
			this.filterWeapons()
			this.computePG()
			this.computeSlots()
		}

		this.computed.hasAutomatedTurret = this.modules.some((module) => module?.name === 'Tourelle automatisée')
		this.computed.hasShoulderTurret = this.modules.some((module) => module?.name === "Tourelle d'épaule")

		if (!this.computed.hasAutomatedTurret) {
			this.automatedTurret = undefined
		}

		if (!this.computed.hasShoulderTurret) {
			this.shoulderTurret = undefined
		}
	}

	computeSlots() {
		this.computed.slotsError = []
		this.computed.slots = [0, 0, 0, 0, 0, 0]

		if (!this._armor) {
			return
		}

		const historic: { module: Module; slots: number[] }[] = []

		for (const module of this.modules) {
			if (!module?.slots.length) {
				continue
			}

			let compatibles = module.slots.filter((slots) => slots.every((slot, index) => this.computed.slots[index] + slot <= this._armor!.slots[index]))

			if (!compatibles.length) {
				for (const slots of module.slots) {
					for (const h of historic) {
						if (h.module.slots.length <= 1) {
							continue
						}

						for (const hSlots of h.module.slots) {
							if (slots.every((slot, index) => this.computed.slots[index] + slot - h.slots[index] + hSlots[index] <= this._armor!.slots[index])) {
								for (let i = 0; i < 6; i++) {
									this.computed.slots[i] += hSlots[i] - h.slots[i]
								}

								h.slots = hSlots
								compatibles = [slots]
							}
						}
					}
				}
			}

			if (!compatibles.length) {
				compatibles = [module.slots[0]]
			}

			historic.push({ module, slots: compatibles[0] })
			for (let i = 0; i < 6; i++) {
				this.computed.slots[i] += compatibles[0][i]
			}
		}

		for (let i = 0; i < 6; i++) {
			if (this.computed.slots[i] > this._armor.slots[i]) {
				this.computed.slotsError.push(i)
			}
		}
	}

	computePG() {
		let sub: Record<'Standard' | 'Avancé' | 'Rare' | 'Prestige', number> = {
			Standard: 0,
			Avancé: 0,
			Rare: 0,
			Prestige: 0
		}
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

		this.computed.availableLevels = ['Standard']

		if (sub.Standard >= 150) {
			this.computed.availableLevels.push('Avancé')
		}

		if (sub.Standard + sub.Avancé >= 350) {
			this.computed.availableLevels.push('Rare')
		}

		if (sub.Standard + sub.Avancé + sub.Rare >= 450) {
			this.computed.availableLevels.push('Prestige')
		}

		if (this._unlockedLevel) {
			if (this.computed.availableLevels.includes(this._unlockedLevel)) {
				this._unlockedLevel = undefined
			} else {
				for (const level of (['Avancé', 'Rare', 'Prestige'] as ('Avancé' | 'Rare' | 'Prestige')[]).filter((l) => !this.computed.availableLevels.includes(l))) {
					this.computed.availableLevels.push(level)

					if (this._unlockedLevel === level) {
						break
					}
				}
			}
		}

		if (this.computed.availableLevels.includes('Prestige')) {
			for (const weapon of this.prestigeWeapons) {
				if (weapon) {
					sub.Prestige += weapon.cost
					total += weapon.cost
				}
			}
		}

		this.computed.pg = Math.max(0, total - Math.min(50, sub.Standard))
		this.computed.pgError = Math.max(0, 50 - sub.Standard)
	}

	markdown() {
		let result = ''

		if (this.portraitImage) {
			result += `![](${this.portraitImage} =${this.portraitWidth || '*'}x${this.portraitHeight || '*'}) `
		}

		if (this.identity) {
			result += `>>!!!${this.identity}!!!>>\n\n`
		}

		if (this.name) {
			result += `>>=======«&nbsp;${this.name}&nbsp;»=======>>\n\n`
		}

		if (this.description) {
			result += `${this.description}\n\n`
		}

		result += '\n\n____\n\n'

		if (this.armor) {
			result += `<<==Armure :== ${this.armor.name}<<\n`
		}

		if (this.section) {
			result += `<<==Section :== ${this.section.name}<<\n`
		}

		if (this.achievement) {
			result += `<<==Haut fait :== ${this.achievementLabel()}<<\n`
		}

		if (this.archetype) {
			result += `<<==Archetype :== ${this.archetypeLabel()}<<\n`
		}

		if (this.crest) {
			result += `<<==Blason :== ${this.crest}<<\n`
		}

		if (this.minorMotivations) {
			result += `<<==Motivations mineurs :== ${this.minorMotivations}<<\n`
		}

		if (this.majorMotivation) {
			result += `<<==Motivation majeure :== ${this.majorMotivation}<<\n`
		}

		const perks = this.perks.filter((p) => p).map((p) => p!.name)
		if (perks.length) {
			result += `<<==Avantages :== ${this.perks
				.filter((p) => p)
				.map((p) => p!.name)
				.join(' / ')}<<\n`
		}

		if (this.heroicCapacities?.length) {
			result += `<<==Capacités héroïques :== ${this.heroicCapacities
				.filter((c) => c)
				.map((c) => c!.name)
				.join(' / ')}<<\n`
		}

		if ((this.section?.flaw && !this.noSectionFlaw) || this.flaw) {
			result += `<<==Inconvénients :== ${[!this.noSectionFlaw ? this.section?.flaw : '', this.flaw].filter((f) => f).join(' / ')}<<\n`
		}

		if (this.computed.freePoints) {
			result += `<<==Points libres :== ${this.computed.freePoints}<<\n`
		}

		if (this.armor) {
			result += `

||||

[[[=
>>ARMURE ${this.armor.name.toUpperCase()}<<
---
>>Armure>> ||: >>${this.computed.armor}<<
---
>>Champs de force>> ||: >>${this.computed.forcefield}<<
---
>>Énergie>> ||: >>${this.computed.energy}<<
]]]

____

`
		}

		result += `[[[=\nCARACTÉRISTIQUES\n---\n`
		result += ASPECTS_LABELS.map((label) => `4| >>**${label.toUpperCase()}**<<`).join(' ||') + '\n---\n'
		result += this.aspects.map((a) => `4|: >>**${a.value}**<<`).join(' ||') + '\n---\n'

		for (let i = 0; i < 3; ++i) {
			result += this.aspects.map((a) => `3| >>${a.characteristics[i].name}<< ||1| >>OD<<`).join(' ||') + '\n---\n'
			result += this.aspects.map((a) => `3|: >>${a.characteristics[i].value}<< ||1|: >>${a.characteristics[i].overdrive || '-'}<<`).join(' ||')

			if (i !== 2) {
				result += '\n---\n'
			}
		}

		result += ']]]\n\n'

		result += `
[[[=
VALEURS DÉRIVÉES
---
>>**POINTS DE SANTÉ**<< || >>**DÉFENSE**<< || >>**RÉACTION**<< || >>**INITIATIVE**<< || >>**POINTS DE CONTACT**<< || >>**POINTS D'ESPOIR**<<
---
: >>${this.computed.ps}<< ||: >>${this.computed.defense}<< ||: >>${this.computed.reaction}<< ||: >>${this.computed.initiative} + ${this.computed.initiativeDices}d6<< ||: >>${this.aspects[3].value}<< ||: >>${this.computed.hope}<<
]]]\n\n
`

		if (this.armor) {
			result += `
[[[=
SLOTS
---
	|| >>**${SLOTS_LABELS.join('**<< || >>**')}**<<
---
>>**Slots**>> ||: >>${this.armor.slots.join('<< ||: >>')}<<
---
>>**Utilisés**>> ||: >>${this.computed.slots.join('<< ||: >>')}<<
]]]\n\n
`
		}

		result += "==Équipement de base :== 3 nods de soin / 3 nods d'énergie / 3 nods d'armure / 5 grenades intelligentes / Marteau-épieu / Pistolet de service\n"

		if (this.section && this.section.modules?.length) {
			result += `==Équipement octroyés par la section ${this.section.name} :== ` + this.section.modules.map((e) => e.name.replace(/ niv\. [1-9]/, '')).join(' / ') + '\n'
		}

		const normalModules = this.modules.filter((m) => m && m.level !== 'Prestige')
		if (normalModules.length) {
			result += `==Modules achetés :== ` + normalModules.map((m) => m!.name).join(' / ') + '\n'
		}

		const prestigeModules = this.modules.filter((m) => m && m.level === 'Prestige')
		if (prestigeModules.length) {
			result += `==Modules de prestige :== ` + prestigeModules.map((m) => m!.name).join(' / ') + '\n'
		}

		if (this.weapons?.length) {
			result +=
				`==Armes achetées :== ` +
				this.weapons
					.map((w, index) => this.weaponLabel(index, w))
					.filter((w) => w)
					.join(' / ') +
				'\n'
		}

		if (this.prestigeWeapons?.length) {
			result += `==Armes de prestige :== ` + this.prestigeWeapons.map((w, index) => this.prestigeWeaponLabel(w, 1000 + index)).join(' / ') + '\n'
		}

		if (this.computed.xp || this.computed.pg) {
			result += `==Total de points d'expérience et de gloire :== ${this.computed.xp}XP et ${this.computed.pg}PG\n`
		}

		return result
	}
}

export class Value {
	constructor(
		public name: string,
		public value: number
	) {}
}

export class Aspect extends Value {
	public characteristics: Characteristic[] = []

	constructor(name: string) {
		super(name, 2)
	}

	max(overdrive = true) {
		return Math.max(...this.characteristics.map((characteristic) => characteristic.value + (overdrive ? characteristic.overdrive : 0)))
	}
}

export class GenerateOptions {
	public pg = 0
	public xp = 0
	public priorities: (Aspect | undefined)[] = [undefined, undefined, undefined]
	public heavyWeapons = true
	public twoHandsWeapons = true
	public oneHandWeapons = true
	public contactWeapons = true
	public distanceWeapons = true
	public weaponUpgrades = true
	public modules: string[] = ['Utilitaire', 'Tactique', 'Défense', 'Déplacement', 'Contact', 'Distance', 'Amélioration', 'Visée', 'Overdrive', 'Automatisé']

	priority(amount: number = 3) {
		return this.priorities.filter((p) => !!p).slice(0, amount)
	}

	filterArchetypes(archetypes: Archetype[]) {
		const scores = new Map<Archetype, number>()
		let max = 0

		for (const archetype of archetypes) {
			let score = 0

			for (const p of this.priority()) {
				for (const bonus of archetype.bonus) {
					if (bonus.some((c) => c.aspect === p)) {
						score += 1
					}
				}
			}

			scores.set(archetype, score)
			max = Math.max(max, score)
		}

		if (max) {
			return archetypes.filter((archetype) => scores.get(archetype) === max)
		}

		return archetypes
	}

	filterAchievements(achievements: Achievement[]) {
		const p = this.priority(1)[0]

		if (p) {
			return achievements.filter((achievement) => achievement.aspects.includes(p))
		}

		return achievements
	}

	filterSections(sections: Section[]) {
		const p = this.priority(1)[0]

		if (p) {
			return sections.filter((section) => section.aspect === p)
		}

		return sections
	}

	filterWeapons(weapons: Weapon[]) {
		if (!this.heavyWeapons && !this.twoHandsWeapons && !this.oneHandWeapons && !this.contactWeapons && !this.distanceWeapons) {
			return []
		}

		return weapons.filter((w) => {
			if (this.contactWeapons !== this.distanceWeapons) {
				if (this.contactWeapons && w.type !== 'contact') {
					return false
				}

				if (this.distanceWeapons && w.type !== 'distance') {
					return false
				}
			}

			if (!this.heavyWeapons && !this.twoHandsWeapons && !this.oneHandWeapons) {
				return true
			}

			if (this.heavyWeapons && w.slots === 3) {
				return true
			}

			if (this.twoHandsWeapons && w.slots === 2) {
				return true
			}

			if (this.oneHandWeapons && w.slots === 1) {
				return true
			}

			return false
		})
	}

	filterModules(modules: Module[]) {
		if (!this.modules.length) {
			return []
		}

		const result = modules.filter((module) => this.modules.includes(module.type))

		if (modules.some((m) => m.overdrive)) {
			for (const a of this.priority()) {
				const filtered = result.filter((m) => !m.overdrive || m.overdrive.aspect === a)
				if (filtered.some((m) => m.overdrive)) {
					return filtered
				}
			}
		}

		return result
	}

	chooseAspect(aspects: Aspect[]) {
		for (const a of this.priority()) {
			if (aspects.includes(a!)) {
				return a
			}
		}

		return sample(aspects)
	}

	chooseCharacteristic(characteristics: Characteristic[]) {
		for (const a of this.priority()) {
			const filtered = characteristics.filter((c) => c.aspect === a)

			if (filtered.length) {
				// Return the higher characteristic than can be increased
				return filtered.filter((c) => c.value < c.aspect.value).reduce((a, b) => (a.value > b.value ? a : b), filtered[0])
			}
		}

		return sample(characteristics)
	}

	chooseForXp(possibilities: { target: Value; cost: number }[]) {
		for (const a of this.priority()) {
			// Look for a characteristic
			let filtered = possibilities.filter((p) => p.target instanceof Characteristic && p.target.aspect === a)
			if (filtered.length) {
				return sample(filtered)
			}

			// Look for the aspect itself
			filtered = possibilities.filter((p) => p.target === a)
			if (filtered.length) {
				return sample(filtered)
			}
		}

		return sample(possibilities)
	}
}

export class Characteristic extends Value {
	public overdrive = 0

	constructor(
		name: string,
		public aspect: Aspect
	) {
		super(name, 1)
	}
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
		public level: 'Standard' | 'Avancé' | 'Rare' | 'Prestige',
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
	public upgrade?: { type: keyof ComputedCharacter; value: number }
	public overdrive?: Characteristic

	constructor(
		public name: string,
		public type: string,
		public cost: number,
		public level: 'Standard' | 'Avancé' | 'Rare' | 'Prestige',
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
		public cost: number,
		public ornementale: boolean
	) {}
}

export class Perk {
	constructor(public name: string) {}
}
