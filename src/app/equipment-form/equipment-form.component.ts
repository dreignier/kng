import { Component, Input } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { AutocompleteLibModule } from 'angular-ng-autocomplete'
import { IMAGES } from '../constants'
import { DatabaseService, DbEffect } from '../database.service'
import { IconComponent } from '../icon/icon.component'
import Effect from '../model/effect'
import Equipment, { AttackRule, DescriptiveRule, DroneRule, ModuleRule, Rule } from '../model/equipment'
import { arrayDown, arrayUp } from '../util'

@Component({
  selector: 'app-equipment-form',
  standalone: true,
  imports: [FormsModule, IconComponent, AutocompleteLibModule],
  templateUrl: './equipment-form.component.html',
  styleUrl: './equipment-form.component.scss'
})
export class EquipmentFormComponent {
	@Input() equipment!: Equipment
	images = IMAGES

	constructor(
		readonly db: DatabaseService
	) {}

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

	upRule(rule: Rule) {
		arrayUp(this.equipment.rules, rule)
	}

	downRule(rule: Rule) {
		arrayDown(this.equipment.rules, rule)
	}

	removeEffect(rule: AttackRule, effect: Effect) {
		rule.effects = rule.effects.filter(e => e !== effect)
	}

	removeRule(rule: Rule) {
		this.equipment.rules = this.equipment.rules.filter(r => r !== rule)
	}

	changed(val: string, target: { name: string }) {
    target.name = val;
  }

  selected<T extends (Effect)>(item: T, target: T) {
    target.import(<any> item);
  }

  filter(items: (DbEffect)[], query: string) {
    return items.filter(e => e.index.includes(query.toLowerCase()));
  }
}
