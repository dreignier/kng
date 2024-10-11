import { Component, Input } from '@angular/core'
import { IconComponent } from '../icon/icon.component'

@Component({
	selector: 'app-modal',
	standalone: true,
	imports: [IconComponent],
	templateUrl: './modal.component.html',
	styleUrl: './modal.component.scss'
})
export class ModalComponent {

	@Input() title?: string
	@Input() large?: boolean
	opened = false
	displayed = false

	constructor() {
		document.addEventListener('keydown', event => {
			if (event.key === 'Escape') {
				this.close()
			}
		})
	}

	open() {
		if (this.opened) {
			return
		}

		this.opened = true
		document.body.classList.add('overflow-y-hidden')

		setTimeout(() => this.displayed = true, 50)
	}

	close() {
		if (!this.displayed) {
			return
		}

		this.displayed = false

		setTimeout(() => {
			this.opened = false
			document.body.classList.remove('overflow-y-hidden')
		}, 150)
	}
}
