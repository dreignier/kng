import { Component, ViewChild } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { DatabaseService } from '../../database.service'
import { DialogService } from '../../dialog/dialog.service'
import { EquipmentFormComponent } from '../../equipment-form/equipment-form.component'
import { EquipmentComponent } from '../../equipment/equipment.component'
import { IconComponent } from '../../icon/icon.component'
import { MessageService } from '../../message/message.service'
import { ModalCanvasComponent } from '../../modal-canvas/modal-canvas.component'
import { ModalComponent } from '../../modal/modal.component'
import Equipment from '../../model/equipment'

@Component({
  selector: 'app-equipment-generator-page',
  standalone: true,
  imports: [EquipmentComponent, EquipmentFormComponent, IconComponent, ModalCanvasComponent, ModalComponent, FormsModule],
  templateUrl: './equipment-generator-page.component.html',
  styleUrl: './equipment-generator-page.component.scss'
})
export class EquipmentGeneratorPageComponent {
	equipment = new Equipment()
	imported = ''
	exported = ''
	massExportNames: Set<string> = new Set()
	massImportStrategy: 'rename' | 'ignore' | 'replace' = 'rename'

	@ViewChild('imageModal') imageModal!: ModalCanvasComponent
	@ViewChild('exportModal') exportModal!: ModalComponent
	@ViewChild('importModal') importModal!: ModalComponent
	@ViewChild('massImportModal') massImportModal!: ModalComponent
	@ViewChild('massExportModal') massExportModal!: ModalComponent

	constructor(
		readonly db: DatabaseService,
		readonly message: MessageService,
		readonly dialog: DialogService
	) {}

	save(equipment: Equipment) {
		if (!equipment.name?.trim()) {
			return
		}

		this.db.saveEquipment(equipment)
		this.message.success('Équipment sauvegardé')
	}

	image(target: string) {
		this.imageModal.open(target)
	}

	openImport() {
		this.imported = ''
		this.importModal.open()
	}

	import() {
		this.equipment = new Equipment()
		this.equipment.import(JSON.parse(this.imported))
		window.scrollTo(0, 0)
		this.importModal.close()
	}

	export(equipment: Equipment) {
		this.exported = JSON.stringify(equipment)
		this.exportModal.open()
	}

	edit(equipment: Equipment) {
		this.equipment = new Equipment()
		this.equipment.import(equipment)
		window.scrollTo(0, 0)
	}

	deleteEquipment(equipment: Equipment) {
		this.dialog.confirm(`Voulez vous vraiment supprimer l'équipment ${equipment.name} ?`).subscribe(() => {
			this.db.deleteEquipment(equipment)
			this.message.success('Équipment supprimé')
		})
	}

	openMassExport() {
		this.massExportNames.clear()
		this.massExportModal.open()
	}

	massExportSelectAll() {
		for (const equipment of this.db.equipments) {
			this.massExportNames.add(equipment.name)
		}
	}

	massExport() {
		this.exported = this.db.exportEquipments(this.massExportNames)
	}

	openMassImport() {
		this.imported = ''
		this.massImportModal.open()
	}

	massImport() {
		let equipments = JSON.parse(this.imported)

		if (equipments) {
			if (!Array.isArray(equipments)) {
        equipments = [equipments];
      }

			equipments = equipments.map((e: any) => new Equipment(e));

			this.db.importEquipments(equipments, this.massImportStrategy)

			this.massImportModal.close()
		}
	}
}
