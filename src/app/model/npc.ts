import { isString } from 'lodash'
import { ALLIE, BANDE, BETE, COLOSSE, DERIVED_VALUES_LABELS, HEROS, HOSTILE, INITIE, MACHINE, MASQUE, PATRON, PATRON_COLOSSE, RECRUE, SALOPARD } from '../constants'
import Aspect from './aspect'
import Capacity from './capacity'
import Entity from './entity'
import Weapon from './weapon'

export default class Npc extends Entity {
  type: string = HOSTILE
  level: string = RECRUE
  aspects: Aspect[] = [new Aspect(), new Aspect(), new Aspect(), new Aspect(), new Aspect()]
  health: number = 0
  armor: number = 0
  energy: number = 0
  shield: number = 0
  forcefield: number = 0
  defense: number = 0
  reaction: number = 0
  initiative: number = 0
  outbreak: number = 0;
  weakness: string = ''
  capacities: Capacity[] = []
  weapons: Weapon[] = []
  resilience: number = 0
  color: string = '#d3181f'

	constructor(data?: any) {
		super()

		if (data) {
			this.import(data)
		}
	}

	import(data: any) {
		this.name = isString(data.name) ? data.name : '';
    this.type = [HOSTILE, SALOPARD, COLOSSE, PATRON, PATRON_COLOSSE, BANDE, ALLIE].includes(data.type?.toLowerCase?.()) ? data.type.toLowerCase() : HOSTILE;
    this.level = [RECRUE, INITIE, HEROS].includes(data.level?.toLowerCase?.()) ? data.level.toLowerCase() : RECRUE;
    this.aspects = (Array.isArray(data.aspects) ? data.aspects : []).map((a: any) => new Aspect(a));
    this.health = Number.isFinite(data.health) ? data.health : 0;
    this.armor = Number.isFinite(data.armor) ? data.armor : 0;
    this.energy = Number.isFinite(data.energy) ? data.energy : 0;
    this.shield = Number.isFinite(data.shield) ? data.shield : 0;
    this.forcefield = Number.isFinite(data.forcefield) ? data.forcefield : 0;
    this.defense = Number.isFinite(data.defense) ? data.defense : 0;
    this.reaction = Number.isFinite(data.reaction) ? data.reaction : 0;
    this.initiative = Number.isFinite(data.initiative) ? data.initiative : 0;
    this.outbreak = Number.isFinite(data.outbreak) ? data.outbreak : 0;
    this.weakness = isString(data.weakness) ? data.weakness : '';
    this.capacities = (Array.isArray(data.capacities) ? data.capacities : []).map((c: any) => new Capacity(c));
    this.weapons = (Array.isArray(data.weapons) ? data.weapons : []).map((w: any) => new Weapon(w));
    this.resilience = Number.isFinite(data.resilience) ? data.resilience : 0;
    this.color = (isString(data.color) && /\#[0-9a-f]{6}/i.test(data.color)) ? data.color : '#d3181f';
	}

	properties() {
		const properties: { label: string; value: any; }[] = []

		for (const key of <(keyof Npc)[]>['defense', 'reaction', 'initiative', 'health', 'resilience', 'armor', 'outbreak', 'shield', 'forcefield', 'energy']) {
			let value = this[key]
			let label = DERIVED_VALUES_LABELS[key]

			if (key === 'health' && this.type === BANDE) {
				label = DERIVED_VALUES_LABELS['cohesion']
			}

			if (!value && ['defense', 'reaction'].includes(key)) {
				value = '-'
			}

			if (value) {
				properties.push({ label, value })
			}
		}

		return properties
	}

	newCapacity() {
		this.capacities.push(new Capacity())
	}

	newWeapon() {
		this.weapons.push(new Weapon())
	}

	computeDefense() {
		this.defense = Math.floor(this.aspects[BETE].score / 2) + this.aspects[MASQUE].exceptional;
	}

	computeReaction() {
		this.reaction = Math.floor(this.aspects[MACHINE].score / 2) + this.aspects[MACHINE].exceptional;
	}

	computeInitiative() {
		if (this.type === BANDE) {
      this.initiative = 0;
    } else if (this.aspects[MASQUE].major) {
      this.initiative = 30;
    } else {
      this.initiative = Math.floor(this.aspects[MASQUE].score / 2) + this.aspects[MASQUE].exceptional;
    }
	}

	computeWeaponRawDamage(weapon: Weapon) {
		weapon.raw = 0;

    if (weapon.contact) {
      if (this.aspects[BETE].exceptional) {
        weapon.raw += this.aspects[BETE].exceptional;

        if (this.aspects[BETE].major) {
          weapon.raw += this.aspects[BETE].score;
        }
      }
    }
	}
}
