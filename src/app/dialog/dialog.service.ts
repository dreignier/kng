import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { DialogComponent } from './dialog.component'

@Injectable({
	providedIn: 'root'
})
export class DialogService {

	private component?: DialogComponent

	setComponent(component: DialogComponent) {
		this.component = component
	}

	confirm(message: string) {
		return new Observable<void>(observer => {
			this.component!.open(message, observer)
		})
	}
}
