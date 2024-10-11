import { Component } from '@angular/core'
import { Observer } from 'rxjs'
import { IconComponent } from '../icon/icon.component'
import { DialogService } from './dialog.service'

@Component({
	selector: 'app-dialog',
	standalone: true,
	imports: [IconComponent],
	templateUrl: './dialog.component.html',
	styleUrl: './dialog.component.scss'
})
export class DialogComponent {
	message: string =''
	opened = false
	displayed = false
	observer?: Observer<void>

	constructor(service: DialogService) {
		service.setComponent(this)

		document.addEventListener('keydown', event => {
			if (event.key === 'Escape') {
				this.close(false)
			}
		})
	}

	open(message: string, observer: Observer<void>) {
		if (this.opened) {
			return
		}

		this.message = message
		this.observer = observer

		this.opened = true
		document.body.classList.add('overflow-y-hidden')

		setTimeout(() => this.displayed = true, 50)
	}

	close(confirm: boolean) {
		if (!this.displayed) {
			return
		}

		if (confirm) {
			this.observer!.next()
		}

		this.observer!.complete()

		this.displayed = false

		setTimeout(() => {
			this.opened = false
			document.body.classList.remove('overflow-y-hidden')
		}, 150)
	}

}
