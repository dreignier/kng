import { Component, ViewChild } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { ColorPickerModule } from 'ngx-color-picker'
import { CodexContentComponent } from '../../codex-content/codex-content.component'
import { ASPECTS_LABELS, SLOTS_LABELS } from '../../constants'
import { DatabaseService } from '../../database.service'
import { DialogService } from '../../dialog/dialog.service'
import { IconComponent } from '../../icon/icon.component'
import { MessageService } from '../../message/message.service'
import { ModalComponent } from '../../modal/modal.component'
import { Character, GenerateOptions } from '../../model/character'

@Component({
	selector: 'app-pc-generator-page',
	standalone: true,
	imports: [IconComponent, FormsModule, CodexContentComponent, ModalComponent, ColorPickerModule],
	templateUrl: './pc-generator-page.component.html',
	styleUrl: './pc-generator-page.component.scss'
})
export class PcGeneratorPageComponent {
	public character!: Character

	@ViewChild('exportModal') exportModal!: ModalComponent
	@ViewChild('importModal') importModal!: ModalComponent
	@ViewChild('massImportModal') massImportModal!: ModalComponent
	@ViewChild('massExportModal') massExportModal!: ModalComponent
	@ViewChild('generateModal') generateModal!: ModalComponent
	imported = ''
	exported = ''
	massImportStrategy: 'rename' | 'ignore' | 'replace' = 'rename'
	massExportNames: Set<string> = new Set()
	options = new GenerateOptions()
	moduleFilters: string[] = []

	constructor(
		readonly db: DatabaseService,
		readonly message: MessageService,
		readonly dialog: DialogService
	) {
		this.reset()

		for (const module of this.character.data.modules) {
			if (!this.moduleFilters.includes(module.type) && module.type !== 'Prestige') {
				this.moduleFilters.push(module.type)
			}
		}
	}

	allModules() {
		this.options.modules = [...this.moduleFilters]
	}

	allWeapons() {
		this.options.heavyWeapons = true
		this.options.twoHandsWeapons = true
		this.options.oneHandWeapons = true
		this.options.contactWeapons = true
		this.options.distanceWeapons = true
	}

	removeAllWeapons() {
		this.options.heavyWeapons = false
		this.options.twoHandsWeapons = false
		this.options.oneHandWeapons = false
		this.options.contactWeapons = false
		this.options.distanceWeapons = false
	}

	reset() {
		this.character = new Character()
	}

	generate() {
		this.character.generate(this.options)
		this.generateModal.close()
	}

	edit(character: Character) {
		this.character = character.clone()
		window.scrollTo(0, 0)
	}

	deleteCharacter(character: Character) {
		this.dialog.confirm(`Voulez vous vraiment supprimer le PJ ${character.name} ?`).subscribe(() => {
			this.db.deleteCharacter(character)
			this.message.success('PNJ supprimé')
		})
	}

	save(character: Character) {
		if (!character.name?.trim()) {
			return
		}

		this.db.saveCharacter(character)
		this.message.success('PJ sauvegardé')
	}

	openImport() {
		this.imported = ''
		this.importModal.open()
	}

	import() {
		this.character = new Character()
		this.character.import(JSON.parse(this.imported))
		window.scrollTo(0, 0)
		this.importModal.close()
	}

	export(character: Character) {
		this.exported = JSON.stringify(character.export())
		this.exportModal.open()
	}

	openMassImport() {
		this.imported = ''
		this.massImportModal.open()
	}

	massImport() {
		let npcs = JSON.parse(this.imported)

		if (npcs) {
			if (!Array.isArray(npcs)) {
				npcs = [npcs]
			}

			npcs = npcs.map((e: any) => {
				const c = new Character()
				c.import(e)
				return c
			})

			this.db.importCharacters(npcs, this.massImportStrategy)

			this.massImportModal.close()
		}
	}

	openMassExport() {
		this.massExportNames.clear()
		this.massExportModal.open()
	}

	massExportSelectAll() {
		for (const character of this.db.characters) {
			this.massExportNames.add(character.name)
		}
	}

	massExport() {
		this.exported = this.db.exportCharacters(this.massExportNames)
	}

	slotsLabel() {
		return this.character.computed.slotsError.map((v) => SLOTS_LABELS[v]).join(', ')
	}

	markdown() {
		const c = this.character
		let result = ''

		if (c.identity) {
			result += `>>!!!${c.identity}!!!>>\n\n`
		}

		if (c.name) {
			result += `>>=======« ${c.name} »=======>>\n\n`
		}

		if (c.description) {
			result += `${c.description}\n\n`
		}

		result += '\n\n____\n\n'

		if (c.armor) {
			result += `<<==Armure :== ${c.armor.name}<<\n`
		}

		if (c.section) {
			result += `<<==Section :== ${c.section.name}<<\n`
		}

		if (c.achievement) {
			result += `<<==Haut fait :== ${c.achievementLabel()}<<\n`
		}

		if (c.archetype) {
			result += `<<==Archetype :== ${c.archetypeLabel()}<<\n`
		}

		if (c.crest) {
			result += `<<==Blason :== ${c.crest}<<\n`
		}

		if (c.minorMotivations) {
			result += `<<==Motivations mineurs :== ${c.minorMotivations}<<\n`
		}

		if (c.majorMotivation) {
			result += `<<==Motivation majeure :== ${c.majorMotivation}<<\n`
		}

		const perks = c.perks.filter((p) => p).map((p) => p!.name)
		if (perks.length) {
			result += `<<==Avantages :== ${c.perks
				.filter((p) => p)
				.map((p) => p!.name)
				.join(' / ')}<<\n`
		}

		if (c.heroicCapacities?.length) {
			result += `<<==Capacités héroïques :== ${c.heroicCapacities
				.filter((c) => c)
				.map((c) => c!.name)
				.join(' / ')}<<\n`
		}

		if ((c.section?.flaw && !c.noSectionFlaw) || c.flaw) {
			result += `<<==Inconvénients :== ${[!c.noSectionFlaw ? c.section?.flaw : '', c.flaw].filter((f) => f).join(' / ')}<<\n`
		}

		if (c.computed.freePoints) {
			result += `<<==Points libres :== ${c.computed.freePoints}\n<<`
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
		result += ASPECTS_LABELS.map((label) => `4| >>**${label.toUpperCase()}**<<`).join(' ||') + '\n---\n'
		result += c.aspects.map((a) => `4|: >>**${a.value}**<<`).join(' ||') + '\n---\n'

		for (let i = 0; i < 3; ++i) {
			result += c.aspects.map((a) => `3| >>${a.characteristics[i].name}<< ||1| >>OD<<`).join(' ||') + '\n---\n'
			result += c.aspects.map((a) => `3|: >>${a.characteristics[i].value}<< ||1|: >>${a.characteristics[i].overdrive || '-'}<<`).join(' ||')

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
: >>${c.computed.ps}<< ||: >>${c.computed.defense}<< ||: >>${c.computed.reaction}<< ||: >>${c.computed.initiative} + ${c.computed.initiativeDices}d6<< ||: >>${c.aspects[3].value}<< ||: >>${c.computed.hope}<<
]]]\n\n
`

		if (c.armor) {
			result += `
[[[=
SLOTS
---
 || >>**${SLOTS_LABELS.join('**<< || >>**')}**<<
---
>>**Slots**>> ||: >>${c.armor.slots.join('<< ||: >>')}<<
---
>>**Utilisés**>> ||: >>${c.computed.slots.join('<< ||: >>')}<<
]]]\n\n
`
		}

		result += "==Équipement de base :== 3 nods de soin / 3 nods d'énergie / 3 nods d'armure / 5 grenades intelligentes / Marteau-épieu / Pistolet de service\n"

		if (c.section && c.section.modules?.length) {
			result += `==Équipement octroyés par la section ${c.section.name} :== ` + c.section.modules.map((e) => e.name.replace(/ niv\. [1-9]/, '')).join(' / ') + '\n'
		}

		if (c.modules?.length) {
			result +=
				`==Modules achetés :== ` +
				c.modules
					.filter((m) => m)
					.map((m) => m!.name)
					.join(' / ') +
				'\n'
		}

		if (c.weapons?.length) {
			result +=
				`==Armes achetées :== ` +
				c.weapons
					.filter((w) => w)
					.map((w) => c.weaponLabel(w!))
					.join(' / ') +
				'\n'
		}

		if (c.computed.xp || c.computed.pg) {
			result += `==Total de points d'expérience et de gloire :== ${c.computed.xp}XP et ${c.computed.pg}PG\n`
		}

		return result
	}
}
