import { Component, Input } from '@angular/core'
import Vehicle from '../model/vehicle'

@Component({
  selector: 'app-vehicle',
  standalone: true,
  imports: [],
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.scss'
})
export class VehicleComponent {
	@Input() vehicle!: Vehicle
}
