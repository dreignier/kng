import { JsonPipe } from '@angular/common'
import { Component } from '@angular/core'
import { IconComponent } from '../icon/icon.component'
import { MessageService } from './message.service'

export type MessageType = 'info' | 'success' | 'warning' | 'error'

@Component({
	selector: 'app-message',
	standalone: true,
	imports: [IconComponent, JsonPipe],
	templateUrl: './message.component.html',
	styleUrl: './message.component.scss'
})
export class MessageComponent {

	messages: { text: string, type: MessageType }[] = []

	constructor(
		service: MessageService
	) {
		service.register(this)
	}

	display(text: string, type: MessageType) {
		this.messages.push({ text, type })

		setTimeout(() => {
			this.messages.shift()
		}, 5000)
	}

}
