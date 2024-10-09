import { BANDE, DERIVED_VALUES_LABELS, HOSTILE, RECRUE } from '../constants'
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
}
