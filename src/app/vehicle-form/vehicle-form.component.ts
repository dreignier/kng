import { Component, Input } from '@angular/core'
import { FormsModule } from '@angular/forms'
import Vehicle from '../model/vehicle'

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './vehicle-form.component.html',
  styleUrl: './vehicle-form.component.scss'
})
export class VehicleFormComponent {
	@Input() vehicle!: Vehicle

}
