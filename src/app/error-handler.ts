import { ErrorHandler, NgZone } from '@angular/core'
import { MessageService } from './message/message.service'

export class GlobalErrorHandler implements ErrorHandler {

	constructor(
		private messageService: MessageService,
		private zone: NgZone
	) { }

	handleError(error: any) {
		console.error(error)

		if (this.messageService.initialized()) {
				this.display('Une erreur inconnue est survenue')
		}

		this.zone.run(() => {})
	}

	display(error: any) {
		this.messageService.error(error)
	}
}
