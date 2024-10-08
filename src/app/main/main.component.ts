import { Component } from '@angular/core'
import { RouterLink, RouterModule } from '@angular/router'
import { IconComponent } from '../icon/icon.component'

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterModule, RouterLink, IconComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

}
