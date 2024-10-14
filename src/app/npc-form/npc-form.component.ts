import { Component, Input, ViewChild } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { ColorPickerModule } from 'ngx-color-picker'
import { ASPECTS_LABELS, BETE, CHAIR, COLORS, DAME, DERIVED_VALUES_LABELS, MACHINE, MASQUE } from '../constants'
import { DatabaseService } from '../database.service'
import { IconComponent } from '../icon/icon.component'
import { ModalComponent } from '../modal/modal.component'
import Capacity from '../model/capacity'
import Effect from '../model/effect'
import Npc, { GenerateOptions } from '../model/npc'
import Weapon from '../model/weapon'
import { arrayDown, arrayUp } from '../util'

@Component({
  selector: 'app-npc-form',
  standalone: true,
  imports: [FormsModule, ColorPickerModule, IconComponent, ModalComponent],
  templateUrl: './npc-form.component.html',
  styleUrl: './npc-form.component.scss'
})
export class NpcFormComponent {
	@Input() npc = new Npc()
	aspects = ASPECTS_LABELS
	properties: (keyof Npc)[] = ['defense', 'reaction', 'initiative', 'health', 'resilience', 'armor', 'outbreak', 'shield', 'forcefield', 'energy']
	propertiesLabel = DERIVED_VALUES_LABELS
	type: string = 'hostile'
	level: string = 'recrue'
	subType: string = 'organique'
	forcefield = false
	energy = false
	resilience = false
	power = 50
	sliders = [5, 5, 5, 5, 5]
	slidersNames = [CHAIR, BETE, MACHINE, DAME, MASQUE]
	slidersLabels = ['Chair', 'Bête', 'Machine', 'Dame', 'Masque']
	slidersColors = ['#9b1a25', '#f25a1e', '#556abc', '#69bfdc', '#70aa6c']

	@ViewChild('generatorModal') generatorModal!: ModalComponent

	constructor(
		readonly db: DatabaseService
	) {}

	colors = COLORS

	computeProperty: { [key: string]: () => void } = {
		defense: () => this.npc.computeDefense(),
		reaction: () => this.npc.computeReaction(),
		initiative: () => this.npc.computeInitiative()
	}

	upCapacity(capacity: Capacity) {
		arrayUp(this.npc.capacities, capacity)
	}

	downCapacity(capacity: Capacity) {
		arrayDown(this.npc.capacities, capacity)
	}

	removeCapacity(capacity: Capacity) {
		this.npc.capacities = this.npc.capacities.filter(c => c !== capacity)
	}

	upWeapon(weapon: Weapon) {
		arrayUp(this.npc.weapons, weapon)
	}

	downWeapon(weapon: Weapon) {
		arrayDown(this.npc.weapons, weapon)
	}

	removeWeapon(weapon: Weapon) {
		this.npc.weapons = this.npc.weapons.filter(w => w !== weapon)
	}

	removeEffect(weapon: Weapon, effect: Effect) {
		weapon.effects = weapon.effects.filter(e => e !== effect)
	}

	toElite() {
		this.npc.elite(this.db)
	}

	generate() {
		const options = new GenerateOptions()
		options.type = this.type
		options.level = this.level
		options.subtype = this.subType
		options.forcefield = this.forcefield
		options.energy = this.energy
		options.resilience = this.resilience
		options.power = this.power
		options.balances = this.sliders

		this.npc.generate(this.db, options)

		this.generatorModal.close()
	}
}
