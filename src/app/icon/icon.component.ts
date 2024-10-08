import { Component, Input } from '@angular/core'
import paths from './paths'

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss'
})
export class IconComponent {
	path: string = paths.default

	@Input() set icon(icon: string) {
		this.path = paths[<keyof typeof paths> icon] || paths.default
	}

}
