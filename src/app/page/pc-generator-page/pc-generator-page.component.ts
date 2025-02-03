import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { CodexContentComponent } from '../../codex-content/codex-content.component'
import { ASPECTS_LABELS } from '../../constants'
import { IconComponent } from '../../icon/icon.component'
import { Character } from '../../model/character'

@Component({
  selector: 'app-pc-generator-page',
  standalone: true,
  imports: [IconComponent, FormsModule, CodexContentComponent],
  templateUrl: './pc-generator-page.component.html',
  styleUrl: './pc-generator-page.component.scss'
})
export class PcGeneratorPageComponent {
	public character!: Character

	constructor() {
		this.reset()
	}

	reset() {
		this.character = new Character()
	}

	generate() {
		this.reset()
		this.character.generate()
	}

	markdown() {
		const c = this.character
		let result = ''

		if (c.identity) {
			result += `>>!!!${ c.identity }!!!>>\n\n`
		}

		if (c.name) {
			result += `>>=======« ${ c.name } »=======>>\n\n`
		}

		if (c.description) {
			result += `${ c.description }\n\n`
		}

		result += '\n\n____\n\n'

		if (c.armor) {
			result += `==Armure :== ${ c.armor.name }\n`
		}

		if (c.section) {
			result += `==Section :== ${ c.section.name }\n`
		}

		if (c.achievement) {
			result += `==Achievement :== ${ c.achievement.name }\n`
		}

		if (c.archetype) {
			result += `==Archetype :== ${ c.archetype.name }\n`
		}

		if (c.crest) {
			result += `==Blason :== ${ c.crest }\n`
		}

		if (c.minorMotivations) {
			result += `==Motivations mineurs :== ${ c.minorMotivations }\n`
		}

		if (c.majorMotivation) {
			result += `==Motivation majeure :== ${ c.majorMotivation }\n`
		}

		const perks = c.perks.filter(p => p).map(p => p!.name)
		if (perks.length) {
			result += `==Avantages :== ${ c.perks.filter(p => p).map(p => p!.name).join(' / ') }\n`
		}

		if (c.heroicCapacities?.length) {
			result += `==Capacités héroïques :== ${ c.heroicCapacities.filter(c => c).map(c => c!.name).join(' / ') }\n`
		}

		if (c.section?.flaw || c.flaw) {
			result += `==Inconvénients :== ${ [c.section?.flaw, c.flaw].filter(f => f).join(' / ') }\n`
		}

		if (c.armor) {
			result += `

||||

[[[=
>>ARMURE ${c.armor.name.toUpperCase()}<<
---
>>Armure>> ||: >>${c.computed.armor}<<
---
>>Champs de force>> ||: >>${c.computed.forcefield}<<
---
>>Énergie>> ||: >>${c.computed.energy}<<
]]]

____

`
		}

		result += `[[[=\nCARACTÉRISTIQUES\n---\n`
		result += ASPECTS_LABELS.map(label => `4| >>**${label.toUpperCase()}**<<`).join(' ||') + '\n---\n'
		result += c.aspects.map(a => `4|: >>**${a.value}**<<`).join(' ||') + '\n---\n'

		for (let i = 0; i < 3; ++i) {
			result += c.aspects.map(a => `3| >>${a.characteristics[i].name}<< ||1| >>OD<<`).join(' ||') + '\n---\n'
			result += c.aspects.map(a => `3|: >>${a.characteristics[i].value}<< ||1|: >>${a.characteristics[i].overdrive || '-'}<<`).join(' ||')

			if (i !== 2) {
				result += '\n---\n'
			}
		}

		result += ']]]\n\n'

		result += `
[[[=
VALEURS DÉRIVÉES
---
>>**POINTS DE SANTÉ**<< || >>**DÉFENSE**<< || >>**RÉACTION**<< || >>**INITIATIVE**<< || >>**POINTS DE CONTACT**<< || >>**POINTS D'ESPOIR**<<
---
: >>${c.computed.ps}<< ||: >>${c.computed.defense}<< ||: >>${c.computed.reaction}<< ||: >>${c.computed.initiative}<< ||: >>${c.aspects[3].value}<< ||: >>${c.computed.hope}<<
]]]

==Équipement de base :== 3 nods de soin / 3 nods d'énergie / 3 nods d'armure / 5 grenades intelligentes / Marteau-épieu / Pistolet de service
`

		if (c.section && c.section.modules?.length) {
			result += `==Équipement octroyés par la section ${c.section.name} :== ` + c.section.modules.map(e => e.name.replace(/ niv\. [1-9]/, '')).join(' / ') + '\n'
		}

		if (c.modules?.length) {
			result += `==Modules achetés :== ` + c.modules.filter(m => m).map(m => m!.name).join(' / ') + '\n'
		}

		if (c.weapons?.length) {
			result += `==Armes achetées :== ` + c.weapons.filter(w => w).map(w => c.weaponLabel(w!)).join(' / ') + '\n'
		}

		if (c.computed.xp || c.computed.pg) {
			result += `==Total de points d'expérience et de gloire :== ${c.computed.xp}XP et ${c.computed.pg}PG\n`
		}

		return result
	}
}
