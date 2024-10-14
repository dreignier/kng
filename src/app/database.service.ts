import { Injectable } from '@angular/core'
import { BANDE, CAPACITIES, COLORS, COLOSSE, EFFECTS, HOSTILE, PATRON, PATRON_COLOSSE, SALOPARD } from './constants'
import Capacity from './model/capacity'
import Effect from './model/effect'
import Npc from './model/npc'

const TYPE_ORDER = [BANDE, HOSTILE, SALOPARD, COLOSSE, PATRON, PATRON_COLOSSE]

export class DbCapacity extends Capacity {
	tags: string[] = []
	index: string = ''

	parse(data: string) {
		const [name, tags, description] = data.split(' | ');

		this.name = name;
		this.description = description;
		this.tags = tags.split(' - ');
		this.index = (this.name + ' ' + this.tags.join(' ')).toLowerCase();
	}
}

export class DbEffect extends Effect {
	tags: string[] = []
	index: string = ''
	cost: number = 0

	parse(data: string) {
		const [name, tags, cost] = data.split(' | ');

		this.name = name;
		this.tags = tags.split(' - ');
		this.cost = Number(cost);
		this.index = (this.name + ' ' + this.tags.join(' ')).toLowerCase();
	}
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

	npcs: Npc[] = []
	capacities: DbCapacity[] = []
	effects: DbEffect[] = []
	colors: string[] = COLORS

	constructor() {
		const json = localStorage.getItem('list')

		if (json) {
			const data = JSON.parse(json)
			this.npcs = data.map((e: any) => new Npc(e))
			this.sortNpcs()
		}

		for (const capacity of CAPACITIES) {
			const c = new DbCapacity()
			c.parse(capacity)
			this.capacities.push(c)
		}

		for (const effect of EFFECTS) {
			const e = new DbEffect()
			e.parse(effect)
			this.effects.push(e)

			if (e.tags.includes('bande')) {
				const capacity = new DbCapacity()

				capacity.name = e.name;
				capacity.description = "Le PNJ bénéficie de l'équivalent de l'effet " + capacity.name + '.';
				capacity.tags = ['effet', ...e.tags.filter(tag => ['bande', 'recrue', 'initié', 'héros', 'autre'].includes(tag))];
				capacity.index = (capacity.name + ' ' + capacity.tags.join(' ')).toLocaleLowerCase();

				this.capacities.push(capacity)
			}
		}

		for (const npc of this.npcs) {
			this.update(npc)
		}

		this.capacities.sort((a, b) => a.index.localeCompare(b.index))
		this.effects.sort((a, b) => a.index.localeCompare(b.index))
	}

	update(npc: Npc) {
		if (!this.colors.includes(npc.color)) {
			this.colors.push(npc.color)
		}

		for (const capacity of npc.capacities) {
			if (!this.capacities.find(e => e.name === capacity.name)) {
				const c = new DbCapacity()
				c.name = capacity.name
				c.description = capacity.description
				c.tags = ['personnalisée']
				c.index = c.name.toLowerCase() + ' personnalisée'
				this.capacities.push(c)
			}
		}

		for (const weapon of npc.weapons) {
			for (const effect of weapon.effects) {
				if (!this.effects.find(e => e.name === effect.name)) {
					const e = new DbEffect()
					e.name = effect.name
					e.tags = ['personnalisé']
					e.cost = 0
					e.index = e.name.toLowerCase() + ' personnalisée'
					this.effects.push(e)
				}
			}
		}
	}

	saveNpc(npc: Npc) {
		const index = this.npcs.findIndex(e => e.name === npc.name)

		if (index === -1) {
			this.npcs.push(npc)
		} else {
			this.npcs[index] = npc
		}

		this.sortNpcs()
		this.saveNpcs()

		this.update(npc)

		this.capacities.sort((a, b) => a.index.localeCompare(b.index))
		this.effects.sort((a, b) => a.index.localeCompare(b.index))
	}

	deleteNpc(npc: Npc) {
		this.npcs = this.npcs.filter(e => e.name !== npc.name)
		this.saveNpcs()
	}

	sortNpcs() {
		this.npcs = this.npcs.sort((a, b) => {
			const colorA = COLORS.indexOf(a.color)
			const colorB = COLORS.indexOf(b.color)

			if (colorA !== colorB) {
				if (colorA !== -1 && colorB !== -1) {
        	return colorA - colorB
				}

				if (colorA !== -1) {
					return -1
				}

				if (colorB !== -1) {
					return 1
				}

				return parseInt(a.color.replace('#', ''), 16) - parseInt(b.color.replace('#', ''), 16)
      }

			const typeA = TYPE_ORDER.indexOf(a.type)
			const typeB = TYPE_ORDER.indexOf(b.type)

			if (typeA !== typeB) {
        if (typeA !== -1 && typeB !== -1) {
        	return typeA - typeB
				}

				if (typeA !== -1) {
					return -1
				}

				if (typeB !== -1) {
					return 1
				}

				return a.type.localeCompare(b.type)
      }

			return a.name.localeCompare(b.name)
		})
	}

	saveNpcs() {
		localStorage.setItem('list', JSON.stringify(this.npcs))
	}

	importNpcs(npcs: Npc[], strategy: 'rename' | 'ignore' | 'replace') {
		if (strategy === 'rename') {
			for (const npc of npcs) {
				if (this.npcs.find(e => e.name === npc.name)) {
					npc.name += ' bis'
				}
			}
		} else if (strategy === 'ignore') {
			npcs = npcs.filter(e => !this.npcs.find(f => f.name === e.name))
		}

		this.npcs = this.npcs.concat(npcs)

		this.sortNpcs()
		this.saveNpcs()
	}

	exportNpcs(names: Set<string>) {
		const npcs = this.npcs.filter(e => names.has(e.name)).map(e => e.export())
		return JSON.stringify(npcs)
	}
}
