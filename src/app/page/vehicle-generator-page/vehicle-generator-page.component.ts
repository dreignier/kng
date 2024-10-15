import { Component, ViewChild } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { DatabaseService } from '../../database.service'
import { DialogService } from '../../dialog/dialog.service'
import { IconComponent } from '../../icon/icon.component'
import { MessageService } from '../../message/message.service'
import { ModalCanvasComponent } from '../../modal-canvas/modal-canvas.component'
import { ModalComponent } from '../../modal/modal.component'
import Vehicle from '../../model/vehicle'
import { VehicleFormComponent } from '../../vehicle-form/vehicle-form.component'
import { VehicleComponent } from '../../vehicle/vehicle.component'

@Component({
  selector: 'app-vehicle-generator-page',
  standalone: true,
  imports: [VehicleComponent, VehicleFormComponent, IconComponent, ModalComponent, ModalCanvasComponent, FormsModule],
  templateUrl: './vehicle-generator-page.component.html',
  styleUrl: './vehicle-generator-page.component.scss'
})
export class VehicleGeneratorPageComponent {
	vehicle = new Vehicle()
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

	save(vehicle: Vehicle) {
		if (!vehicle.name?.trim()) {
			return
		}

		this.db.saveVehicle(vehicle)
		this.message.success('Véhicule sauvegardé')
	}

	image(target: string) {
		this.imageModal.open(target)
	}

	openImport() {
		this.imported = ''
		this.importModal.open()
	}

	import() {
		this.vehicle = new Vehicle()
		this.vehicle.import(JSON.parse(this.imported))
		window.scrollTo(0, 0)
		this.importModal.close()
	}

	export(vehicle: Vehicle) {
		this.exported = JSON.stringify(vehicle)
		this.exportModal.open()
	}

	edit(vehicle: Vehicle) {
		this.vehicle = new Vehicle()
		this.vehicle.import(vehicle)
		window.scrollTo(0, 0)
	}

	deleteVehicle(vehicle: Vehicle) {
		this.dialog.confirm(`Voulez vous vraiment supprimer le véhicule ${vehicle.name} ?`).subscribe(() => {
			this.db.deleteVehicle(vehicle)
			this.message.success('Véhicule supprimé')
		})
	}

	openMassExport() {
		this.massExportNames.clear()
		this.massExportModal.open()
	}

	massExportSelectAll() {
		for (const vehicle of this.db.vehicles) {
			this.massExportNames.add(vehicle.name)
		}
	}

	massExport() {
		this.exported = this.db.exportVehicles(this.massExportNames)
	}

	openMassImport() {
		this.imported = ''
		this.massImportModal.open()
	}

	massImport() {
		let vehicles = JSON.parse(this.imported)

		if (vehicles) {
			if (!Array.isArray(vehicles)) {
        vehicles = [vehicles];
      }

			vehicles = vehicles.map((e: any) => new Vehicle(e));

			this.db.importVehicles(vehicles, this.massImportStrategy)

			this.massImportModal.close()
		}
	}
}
