import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { DialogComponent } from './dialog/dialog.component'
import { MessageComponent } from './message/message.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DialogComponent, MessageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'project';
}
