import { JsonPipe } from '@angular/common'
import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { IconComponent } from '../../icon/icon.component'
import { Character } from '../../model/character'

@Component({
  selector: 'app-pc-generator-page',
  standalone: true,
  imports: [IconComponent, FormsModule, JsonPipe],
  templateUrl: './pc-generator-page.component.html',
  styleUrl: './pc-generator-page.component.scss'
})
export class PcGeneratorPageComponent {
	public character!: Character

	constructor() {
		this.reset()
	}

	reset() {
		this.character = new Character()
	}

	generate() {
		this.reset()
		this.character.generate()
	}
}
