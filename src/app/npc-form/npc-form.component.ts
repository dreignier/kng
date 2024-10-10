import { Component, Input } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { ColorPickerModule } from 'ngx-color-picker'
import { ASPECTS_LABELS, COLORS, DERIVED_VALUES_LABELS } from '../constants'
import { IconComponent } from '../icon/icon.component'
import Capacity from '../model/capacity'
import Effect from '../model/effect'
import Npc from '../model/npc'
import Weapon from '../model/weapon'
import { arrayDown, arrayUp } from '../util'

@Component({
  selector: 'app-npc-form',
  standalone: true,
  imports: [FormsModule, ColorPickerModule, IconComponent],
  templateUrl: './npc-form.component.html',
  styleUrl: './npc-form.component.scss'
})
export class NpcFormComponent {
	@Input() npc = new Npc()
	aspects = ASPECTS_LABELS
	properties: (keyof Npc)[] = ['defense', 'reaction', 'initiative', 'health', 'resilience', 'armor', 'outbreak', 'shield', 'forcefield', 'energy']
	propertiesLabel = DERIVED_VALUES_LABELS

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
}
