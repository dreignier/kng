import { Component, Input } from '@angular/core'
import { DatabaseService } from '../database.service'
import Vehicle from '../model/vehicle'

@Component({
  selector: 'app-vehicle',
  standalone: true,
  imports: [],
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.scss'
})
export class VehicleComponent {
	@Input() vehicle?: Vehicle

	constructor(
		readonly db: DatabaseService
	) {}

	@Input() set name(name: string) {
		this.vehicle = this.db.findVehicle(name)
	}
}
