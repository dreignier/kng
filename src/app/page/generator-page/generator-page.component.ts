import { Component, ViewChild } from '@angular/core'
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
  selector: 'app-generator-page',
  standalone: true,
  imports: [NpcComponent, NpcFormComponent, IconComponent, ModalCanvasComponent, ModalComponent],
  templateUrl: './generator-page.component.html',
  styleUrl: './generator-page.component.scss'
})
export class GeneratorPageComponent {
	npc = new Npc()

	@ViewChild('imageModal') imageModal!: ModalCanvasComponent
	@ViewChild('exportModal') exportModal!: ModalComponent
	exported = ''

	constructor(
		readonly db: DatabaseService,
		readonly message: MessageService,
		readonly dialog: DialogService
	) {
		db.loadNpcs()
	}

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

	import(json: string) {

	}

	export(npc: Npc) {
		this.exported = JSON.stringify(npc)
		this.exportModal.open()
	}
}
