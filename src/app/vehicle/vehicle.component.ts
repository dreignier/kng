import { Component, Input, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'
import { DatabaseService } from '../database.service'
import Vehicle from '../model/vehicle'

@Component({
  selector: 'app-vehicle',
  standalone: true,
  imports: [],
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.scss'
})
export class VehicleComponent implements OnDestroy {
	@Input() vehicle?: Vehicle
	private subscription?: Subscription

	constructor(
		readonly db: DatabaseService
	) {}

	ngOnDestroy(): void {
		this.subscription?.unsubscribe()
	}

	@Input() set name(name: string) {
		this.vehicle = this.db.findVehicle(name)

		if (!this.subscription) {
			this.subscription = this.db.change.subscribe(() => {
				this.vehicle = this.db.findVehicle(name)
			})
		}
	}
}
