import { Component } from '@angular/core'
import { ALLIE, BANDE, COLOSSE, HEROS, HOSTILE, INITIE, PATRON, PATRON_COLOSSE, RECRUE, SALOPARD } from '../../constants'
import { DatabaseService } from '../../database.service'
import { NpcGrid, grid } from '../../model/npc'

@Component({
  selector: 'app-constants-page',
  standalone: true,
  imports: [],
  templateUrl: './constants-page.component.html',
  styleUrl: './constants-page.component.scss'
})
export class ConstantsPageComponent {
	lines: { type: string; level: string; infos: NpcGrid }[] = [];

  constructor(
		readonly db: DatabaseService
	) {

    for (const type of [HOSTILE, SALOPARD, COLOSSE, PATRON, PATRON_COLOSSE, BANDE, ALLIE]) {
      for (const level of [RECRUE, INITIE, HEROS]) {
        this.lines.push({ type, level, infos: grid(type, level) });
      }
    }
  }
}
