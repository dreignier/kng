import { Component, Input, ViewChild } from '@angular/core'
import html2canvas from 'html2canvas'
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
	@ViewChild('modal') modal!: ModalComponent

	async open(target: string) {
		this.modal.open()

		setTimeout(async () => {
			const canvas = await html2canvas(<HTMLElement> document.getElementById(target)!.children[0], {
				scrollX: 0,
				scrollY: -window.scrollY
			});

			document.getElementById('canvas')!.innerHTML = '<img src="' + canvas.toDataURL() + '" />';
		}, 50)
	}
}
