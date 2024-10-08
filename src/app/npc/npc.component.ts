import { JsonPipe } from '@angular/common'
import { Component, Input } from '@angular/core'
import { ASPECTS_LABELS } from '../constants'
import Npc from '../model/npc'

@Component({
  selector: 'app-npc',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './npc.component.html',
  styleUrl: './npc.component.scss'
})
export class NpcComponent {
	@Input() npc = new Npc()
	aspects = ASPECTS_LABELS

}
