import { Component, Input } from '@angular/core'
import { FormsModule } from '@angular/forms'
import Npc from '../model/npc'

@Component({
  selector: 'app-npc-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './npc-form.component.html',
  styleUrl: './npc-form.component.scss'
})
export class NpcFormComponent {
	@Input() npc = new Npc()
}
