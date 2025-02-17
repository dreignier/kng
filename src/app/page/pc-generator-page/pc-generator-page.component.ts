import { Component, ViewChild } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { ColorPickerModule } from 'ngx-color-picker'
import { CodexContentComponent } from '../../codex-content/codex-content.component'
import { SLOTS_LABELS } from '../../constants'
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
		this.options.weaponUpgrades = true
	}

	removeAllWeapons() {
		this.options.heavyWeapons = false
		this.options.twoHandsWeapons = false
		this.options.oneHandWeapons = false
		this.options.contactWeapons = false
		this.options.distanceWeapons = false
		this.options.weaponUpgrades = false
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
}
