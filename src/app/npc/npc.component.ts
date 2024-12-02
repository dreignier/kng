import { Component, Input, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'
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
export class NpcComponent implements OnDestroy {
	@Input() npc?: Npc
	aspects = ASPECTS_LABELS
	private subscription?: Subscription

	constructor(
		readonly db: DatabaseService
	) {}

	@Input() set name(name: string) {
		this.npc = this.db.findNpc(name)

		if (!this.subscription) {
			this.subscription = this.db.change.subscribe(() => {
				this.npc = this.db.findNpc(name)
			})
		}
	}

	ngOnDestroy(): void {
		this.subscription?.unsubscribe()
	}
}
