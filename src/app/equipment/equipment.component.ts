import { Component, Input, OnDestroy } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'
import { Subscription } from 'rxjs'
import { DatabaseService } from '../database.service'
import Equipment, { AttackRule, DescriptiveRule, DroneRule, ModuleRule, Rule } from '../model/equipment'

@Component({
  selector: 'app-equipment',
  standalone: true,
  imports: [],
  templateUrl: './equipment.component.html',
  styleUrl: './equipment.component.scss'
})
export class EquipmentComponent implements OnDestroy {
	@Input() equipment?: Equipment
	private subscription?: Subscription

	primaryColors: Record<string, string> = {
		standard: '#bee3f5',
		avancé: '#ded5e9',
		rare: '#fee6ca',
		prestige: '#e7ebee',
		["relique d\'espoir"]: '#f1e7d2'
	}

	secondaryColors: Record<string, string> = {
		standard: '#45afce',
		avancé: '#cb559f',
		rare: '#f58b1f',
		prestige: '#797e81',
		["relique d\'espoir"]: '#b88434'
	}

	tertiaryColors: Record<string, string> = {
		standard: '#32b7dc',
		avancé: '#c162a6',
		rare: '#f68421',
		prestige: '#9d9d9c',
		["relique d\'espoir"]: '#ba881d'
	}

	logoColors: Record<string, string> = {
		standard: '#377d63',
		avancé: '#684a9d',
		rare: '#f68421',
		prestige: '#9d9d9c',
		["relique d\'espoir"]: '#ba881d'
	}

	isShiny: Record<string, boolean> = {
		prestige: true,
		["relique d\'espoir"]: true
	}

	constructor(
		readonly sanitizer: DomSanitizer,
		readonly db: DatabaseService
	) {}

	ngOnDestroy(): void {
		this.subscription?.unsubscribe()
	}

	@Input() set name(name: string) {
		this.equipment = this.db.findEquipment(name)

		if (!this.subscription) {
			this.subscription = this.db.change.subscribe(() => {
				this.equipment = this.db.findEquipment(name)
			})
		}
	}

	primary(level?: string) {
		if (!level) {
			return this.primaryColors['standard']
		}

		return this.primaryColors[level] || this.primaryColors['standard']
	}

	secondary(level?: string) {
		if (!level) {
			return this.secondaryColors['standard']
		}

		return this.secondaryColors[level] || this.secondaryColors['standard']
	}

	tertiary(level?: string) {
		if (!level) {
			return this.tertiaryColors['standard']
		}

		return this.tertiaryColors[level] || this.tertiaryColors['standard']
	}

	logo(level?: string) {
		if (!level) {
			return this.logoColors['standard']
		}

		return this.logoColors[level] || this.logoColors['standard']
	}

	shiny(level?: string) {
		if (!level) {
			return false
		}

		return this.isShiny[level] || false
	}

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
