import { Component } from '@angular/core'
import Npc from '../../model/npc'
import { NpcFormComponent } from '../../npc-form/npc-form.component'
import { NpcComponent } from '../../npc/npc.component'

@Component({
  selector: 'app-generator-page',
  standalone: true,
  imports: [NpcComponent, NpcFormComponent],
  templateUrl: './generator-page.component.html',
  styleUrl: './generator-page.component.scss'
})
export class GeneratorPageComponent {
	npc = new Npc()
}
