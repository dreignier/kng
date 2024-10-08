import { Component } from '@angular/core'
import { DatabaseService } from '../../database.service'
import { IconComponent } from '../../icon/icon.component'
import Npc from '../../model/npc'
import { NpcFormComponent } from '../../npc-form/npc-form.component'
import { NpcComponent } from '../../npc/npc.component'

@Component({
  selector: 'app-generator-page',
  standalone: true,
  imports: [NpcComponent, NpcFormComponent, IconComponent],
  templateUrl: './generator-page.component.html',
  styleUrl: './generator-page.component.scss'
})
export class GeneratorPageComponent {
	npc = new Npc()

	constructor(
		readonly db: DatabaseService
	) {
		db.loadNpcs()
	}

	editNpc(npc: Npc) {
		this.npc.import(npc)
		window.scrollTo(0, 0)
	}

	deleteNpc(npc: Npc) {

	}

	saveNpc(npc: Npc) {
		this.db.saveNpc(npc)
	}
}
