import { Component, Input, ViewChild } from '@angular/core'
import { toPng } from 'html-to-image'
import { ModalComponent } from '../modal/modal.component'

@Component({
  selector: 'app-modal-canvas',
  standalone: true,
  imports: [ModalComponent],
  templateUrl: './modal-canvas.component.html',
  styleUrl: './modal-canvas.component.scss'
})
export class ModalCanvasComponent {

	@Input() target!: string
	@Input() bgColor?: string
	@ViewChild('modal') modal!: ModalComponent

	open(target: string) {
		document.getElementById('canvas')!.innerHTML = ''
		this.modal.open()

		return new Promise<void>(resolve => {
			setTimeout(async () => {
				const dataUrl = await toPng(<HTMLElement> document.getElementById(target)!.children[0])
				document.getElementById('canvas')!.innerHTML = '<img src="' + dataUrl + '"' + (this.bgColor ? `style="background-color: ${this.bgColor};"` : '') + '/>';
				resolve()
			}, 50)
		})
	}
}
