import { Component, Input } from '@angular/core'
import { ASPECTS_LABELS } from '../constants'
import { DatabaseService } from '../database.service'
import Npc from '../model/npc'

@Component({
  selector: 'app-npc',
  standalone: true,
  imports: [],
  templateUrl: './npc.component.html',
  styleUrl: './npc.component.scss'
})
export class NpcComponent {
	@Input() npc?: Npc
	aspects = ASPECTS_LABELS

	constructor(
		readonly db: DatabaseService,
	) {}

	@Input() set name(name: string) {
		this.npc = this.db.findNpc(name)
	}
}
