import { Component, Input } from '@angular/core'
import Equipment, { AttackRule, DescriptiveRule, DroneRule, ModuleRule, Rule } from '../model/equipment'

@Component({
  selector: 'app-equipment',
  standalone: true,
  imports: [],
  templateUrl: './equipment.component.html',
  styleUrl: './equipment.component.scss'
})
export class EquipmentComponent {
	@Input() equipment!: Equipment

	isAttackRule(rule: Rule) {
		return rule instanceof AttackRule
	}

	isModuleRule(rule: Rule) {
		return rule instanceof ModuleRule
	}

	isDescriptiveRule(rule: Rule) {
		return rule instanceof DescriptiveRule
	}

	isDroneRule(rule: Rule) {
		return rule instanceof DroneRule

	}

	effects(rule: AttackRule) {
		return rule.effects.map(e => e.name).join(' / ')
	}
}
