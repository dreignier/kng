import { Injectable } from '@angular/core'
import { BANDE, COLORS, COLOSSE, HOSTILE, PATRON, PATRON_COLOSSE, SALOPARD } from './constants'
import Npc from './model/npc'

const TYPE_ORDER = [BANDE, HOSTILE, SALOPARD, COLOSSE, PATRON, PATRON_COLOSSE]

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

	npcs: Npc[] = []

	loadNpcs() {
		const json = localStorage.getItem('list')

		if (json) {
			const data = JSON.parse(json)
			this.npcs = data.map((e: any) => new Npc(e))
			this.sortNpcs()
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
		const npcs = this.npcs.filter(e => names.has(e.name))
		return JSON.stringify(npcs)
	}
}
