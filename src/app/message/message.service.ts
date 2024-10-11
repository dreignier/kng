import { Injectable } from '@angular/core'
import { MessageComponent } from './message.component'

@Injectable({
	providedIn: 'root'
})
export class MessageService {

	component?: MessageComponent

	constructor() { }

	initialized() {
		return this.component !== undefined
	}

	register(component: MessageComponent) {
		this.component = component
	}

	info(message: string) {
		this.component!.display(message, 'info')
	}

	success(message: string) {
		this.component!.display(message, 'success')
	}

	warning(message: string) {
		this.component!.display(message, 'warning')
	}

	error(message: string) {
		this.component!.display(message, 'error')
	}
}
