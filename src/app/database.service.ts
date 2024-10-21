import { Injectable } from '@angular/core'
import { ADVANCED, BANDE, CAPACITIES, COLORS, COLOSSE, EFFECTS, HOSTILE, PATRON, PATRON_COLOSSE, RARE, SALOPARD, STANDARD } from './constants'
import Capacity from './model/capacity'
import Effect from './model/effect'
import Equipment, { AttackRule } from './model/equipment'
import News from './model/news'
import Npc from './model/npc'
import Vehicle from './model/vehicle'

const TYPE_ORDER = [BANDE, HOSTILE, SALOPARD, COLOSSE, PATRON, PATRON_COLOSSE]
const LEVEL_ORDER = [STANDARD, ADVANCED, RARE]

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
	equipments: Equipment[] = []
	vehicles: Vehicle[] = []
	news: News[] = []
	capacities: DbCapacity[] = []
	effects: DbEffect[] = []
	colors: string[] = COLORS

	constructor() {
		let json = localStorage.getItem('list')

		if (json) {
			const data = JSON.parse(json)
			this.npcs = data.map((e: any) => new Npc(e))
			this.sortNpcs()
		}

		json = localStorage.getItem('equipmentList')
		if (json) {
			const data = JSON.parse(json)
			this.equipments = data.map((e: any) => new Equipment(e))
			this.sortEquipments()
		}

		json = localStorage.getItem('vehicleList')
		if (json) {
			const data = JSON.parse(json)
			this.vehicles = data.map((e: any) => new Vehicle(e))
		}

		json = localStorage.getItem('newsList')
		if (json) {
			const data = JSON.parse(json)
			this.news = data.map((e: any) => new News(e))
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
			this.updateFromNpc(npc)
		}

		for (const equipment of this.equipments) {
			this.updateFromEquipment(equipment)
		}

		this.sortNpcs()
		this.sortEquipments()
		this.sortVehicles()

		this.capacities.sort((a, b) => a.index.localeCompare(b.index))
		this.effects.sort((a, b) => a.index.localeCompare(b.index))
	}

	updateColor(color: string) {
		if (!this.colors.includes(color)) {
			this.colors.push(color)
		}
	}

	updateCapacities(capacities: Capacity[]) {
		for (const capacity of capacities) {
			if (!this.capacities.find(e => e.name === capacity.name)) {
				const c = new DbCapacity()
				c.name = capacity.name
				c.description = capacity.description
				c.tags = ['personnalisée']
				c.index = c.name.toLowerCase() + ' personnalisée'
				this.capacities.push(c)
			}
		}
	}

	updateEffects(effects: Effect[]) {
		for (const effect of effects) {
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

	updateFromNpc(npc: Npc) {
		this.updateColor(npc.color)
		this.updateCapacities(npc.capacities)

		for (const weapon of npc.weapons) {
			this.updateEffects(weapon.effects)
		}
	}

	updateFromEquipment(equipment: Equipment) {
		for (const rule of equipment.rules) {
			if (rule instanceof AttackRule) {
				this.updateEffects(rule.effects)
			}
		}
	}

	saveNpc(npc: Npc) {
		const data = new Npc(npc)

		const index = this.npcs.findIndex(e => e.name === data.name)

		if (index === -1) {
			this.npcs.push(data)
		} else {
			this.npcs[index] = data
		}

		this.sortNpcs()
		this.saveNpcs()

		this.updateFromNpc(data)

		this.capacities.sort((a, b) => a.index.localeCompare(b.index))
		this.effects.sort((a, b) => a.index.localeCompare(b.index))
	}

	saveEquipment(equipment: Equipment) {
		const data = new Equipment(equipment)
		const index = this.equipments.findIndex(e => e.name === data.name)

		if (index === -1) {
			this.equipments.push(data)
		} else {
			this.equipments[index] = data
		}

		this.sortEquipments()
		this.saveEquipments()

		this.updateFromEquipment(data)

		this.effects.sort((a, b) => a.index.localeCompare(b.index))
	}

	saveVehicle(vehicle: Vehicle) {
		const data = new Vehicle(vehicle)
		const index = this.vehicles.findIndex(e => e.name === data.name)

		if (index === -1) {
			this.vehicles.push(data)
		} else {
			this.vehicles[index] = data
		}

		this.sortVehicles()
		this.saveVehicles()
	}

	deleteNpc(npc: Npc) {
		this.npcs = this.npcs.filter(e => e.name !== npc.name)
		this.saveNpcs()
	}

	deleteEquipment(equipment: Equipment) {
		this.equipments = this.equipments.filter(e => e.name !== equipment.name)
		this.saveEquipments()
	}

	deleteVehicle(vehicle: Vehicle) {
		this.vehicles = this.vehicles.filter(e => e.name !== vehicle.name)
		this.saveVehicles();
	}

	saveVehicles() {
		localStorage.setItem('vehicleList', JSON.stringify(this.vehicles))
	}

	sortVehicles() {
		this.vehicles = this.vehicles.sort((a, b) => a.name.localeCompare(b.name))
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

	sortEquipments() {
		this.equipments = this.equipments.sort((a, b) => {
			if (a.image !== b.image) {
				if (!a.image) {
					return -1
				}

				if (!b.image) {
					return 1
				}

				return a.image.localeCompare(b.image)
			}

			const levelA = LEVEL_ORDER.indexOf(a.type)
			const levelB = LEVEL_ORDER.indexOf(b.type)

			if (levelA !== levelB) {
        if (levelA !== -1 && levelB !== -1) {
        	return levelA - levelB
				}

				if (levelA !== -1) {
					return -1
				}

				if (levelB !== -1) {
					return 1
				}

				return a.type.localeCompare(b.type)
      }

			return a.name.localeCompare(b.name)
		})
	}

	saveNpcs() {
		localStorage.setItem('list', JSON.stringify(this.npcs.map(e => e.export())))
	}

	saveEquipments() {
		localStorage.setItem('equipmentList', JSON.stringify(this.equipments))
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

		for (const npc of this.npcs) {
			this.updateFromNpc(npc)
		}

		this.capacities.sort((a, b) => a.index.localeCompare(b.index))
		this.effects.sort((a, b) => a.index.localeCompare(b.index))
	}

	exportNpcs(names: Set<string>) {
		const npcs = this.npcs.filter(e => names.has(e.name)).map(e => e.export())
		return JSON.stringify(npcs)
	}

	exportEquipments(names: Set<string>) {
		const equipments = this.equipments.filter(e => names.has(e.name))
		return JSON.stringify(equipments)
	}

	exportVehicles(names: Set<string>) {
		const vehicles = this.vehicles.filter(e => names.has(e.name))
		return JSON.stringify(vehicles)
	}

	importEquipments(equipments: Equipment[], strategy: 'rename' | 'ignore' | 'replace') {
		if (strategy === 'rename') {
			for (const equipment of equipments) {
				if (this.equipments.find(e => e.name === equipment.name)) {
					equipment.name += ' bis'
				}
			}
		} else if (strategy === 'ignore') {
			equipments = equipments.filter(e => !this.equipments.find(f => f.name === e.name))
		}

		this.equipments = this.equipments.concat(equipments)

		this.sortEquipments()
		this.saveEquipments()

		for (const equipment of this.equipments) {
			this.updateFromEquipment(equipment)
		}

		this.effects.sort((a, b) => a.index.localeCompare(b.index))
	}

	importVehicles(vehicles: Vehicle[], strategy: 'rename' | 'ignore' | 'replace') {
		if (strategy === 'rename') {
			for (const vehicle of vehicles) {
				if (this.vehicles.find(e => e.name === vehicle.name)) {
					vehicle.name += ' bis'
				}
			}
		} else if (strategy === 'ignore') {
			vehicles = vehicles.filter(e => !this.vehicles.find(f => f.name === e.name))
		}

		this.vehicles = this.vehicles.concat(vehicles)

		this.sortVehicles()
		this.saveVehicles()
	}

	saveNews(news: News) {
		const data = new News(news)
		const index = this.news.findIndex(e => e.name === data.name)

		if (index === -1) {
			this.news.push(data)
		} else {
			this.news[index] = data
		}

		this.sortNews()
		this.saveAllNews()
	}

	saveAllNews() {
		localStorage.setItem('newsList', JSON.stringify(this.news))
	}

	sortNews() {
		this.news = this.news.sort((a, b) => a.name.localeCompare(b.name))
	}

	exportNews(names: Set<string>) {
		const news = this.news.filter(e => names.has(e.name))
		return JSON.stringify(news)
	}

	importNews(allNews: News[], strategy: 'rename' | 'ignore' | 'replace') {
		if (strategy === 'rename') {
			for (const news of allNews) {
				if (this.news.find(e => e.name === news.name)) {
					news.name += ' bis'
				}
			}
		} else if (strategy === 'ignore') {
			allNews = allNews.filter(e => !this.news.find(f => f.name === e.name))
		}

		this.news = this.news.concat(allNews)

		this.sortNews()
		this.saveAllNews()
	}

	deleteNews(news: News) {
		this.news = this.news.filter(e => e.name !== news.name)
		this.saveAllNews()
	}
}
