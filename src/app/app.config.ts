import { ApplicationConfig, ErrorHandler, NgZone, provideZoneChangeDetection } from '@angular/core'
import { provideRouter } from '@angular/router'

import { routes } from './app.routes'
import { GlobalErrorHandler } from './error-handler'
import { MessageService } from './message/message.service'

export const appConfig: ApplicationConfig = {
  providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes),
		{
			provide: ErrorHandler,
			useFactory(messageService: MessageService, zone: NgZone) { return new GlobalErrorHandler(messageService, zone) },
			deps: [MessageService, NgZone]
		}
	]
};
