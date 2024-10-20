import { Component, ViewChild } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { DatabaseService } from '../../database.service'
import { DialogService } from '../../dialog/dialog.service'
import { IconComponent } from '../../icon/icon.component'
import { MessageService } from '../../message/message.service'
import { ModalCanvasComponent } from '../../modal-canvas/modal-canvas.component'
import { ModalComponent } from '../../modal/modal.component'
import Npc from '../../model/npc'
import { NpcFormComponent } from '../../npc-form/npc-form.component'
import { NpcComponent } from '../../npc/npc.component'

@Component({
  selector: 'app-npc-generator-page',
  standalone: true,
  imports: [NpcComponent, NpcFormComponent, IconComponent, ModalCanvasComponent, ModalComponent, FormsModule],
  templateUrl: './npc-generator-page.component.html',
  styleUrl: './npc-generator-page.component.scss'
})
export class NpcGeneratorPageComponent {
	npc = new Npc()

	@ViewChild('imageModal') imageModal!: ModalCanvasComponent
	@ViewChild('exportModal') exportModal!: ModalComponent
	@ViewChild('importModal') importModal!: ModalComponent
	@ViewChild('massImportModal') massImportModal!: ModalComponent
	@ViewChild('massExportModal') massExportModal!: ModalComponent
	imported = ''
	exported = ''
	massImportStrategy: 'rename' | 'ignore' | 'replace' = 'rename'
	massExportNames: Set<string> = new Set()

	constructor(
		readonly db: DatabaseService,
		readonly message: MessageService,
		readonly dialog: DialogService
	) {}

	editNpc(npc: Npc) {
		this.npc = new Npc()
		this.npc.import(npc)
		window.scrollTo(0, 0)
	}

	deleteNpc(npc: Npc) {
		this.dialog.confirm(`Voulez vous vraiment supprimer le PNJ ${npc.name} ?`).subscribe(() => {
			this.db.deleteNpc(npc)
			this.message.success('PNJ supprimé')
		})
	}

	saveNpc(npc: Npc) {
		if (!npc.name?.trim()) {
			return
		}

		this.db.saveNpc(npc)
		this.message.success('PNJ sauvegardé')
	}

	image(target: string) {
		this.imageModal.open(target)
	}

	openImport() {
		this.imported = ''
		this.importModal.open()
	}

	import() {
		this.npc = new Npc()
		this.npc.import(JSON.parse(this.imported))
		window.scrollTo(0, 0)
		this.importModal.close()
	}

	export(npc: Npc) {
		this.exported = JSON.stringify(npc.export())
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
        npcs = [npcs];
      }

			npcs = npcs.map((e: any) => new Npc(e));

			this.db.importNpcs(npcs, this.massImportStrategy)

			this.massImportModal.close()
		}
	}

	openMassExport() {
		this.massExportNames.clear()
		this.massExportModal.open()
	}

	massExportSelectAll() {
		for (const npc of this.db.npcs) {
			this.massExportNames.add(npc.name)
		}
	}

	massExport() {
		this.exported = this.db.exportNpcs(this.massExportNames)
	}
}
