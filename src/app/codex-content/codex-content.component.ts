import { Component, Input } from '@angular/core'
import { EquipmentComponent } from '../equipment/equipment.component'
import { NpcComponent } from '../npc/npc.component'
import { showdownConverter } from '../util'
import { VehicleComponent } from '../vehicle/vehicle.component'

type CodexContentPart = { component?: string; text: string; scale?: number; mb?: number; id: string }

@Component({
  selector: 'app-codex-content',
  standalone: true,
  imports: [NpcComponent, EquipmentComponent, VehicleComponent],
  templateUrl: './codex-content.component.html',
  styleUrl: './codex-content.component.scss'
})
export class CodexContentComponent {
	@Input() width!: number;
	@Input() direction: 'left' | 'right' = 'left';
	parts: CodexContentPart[] = []
	private scaleCache: Record<string, { scale: number; mb: number }> = {}

	converter = showdownConverter({
		type: 'output',
		regex: /{{{[ \n]*([^}]+)[ \n]*}}}/g,
		replace: '<div class="panel">$1</div>'
	})

	@Input() set content(content: string) {
		this.parts = []

		if (!content.trim()) {
			return
		}

		let index = 0

		for (const match of Array.from(content.matchAll(/\[([a-z]{3}):([^\]]+)\]/gmi))) {
			this.createTextPart(content.slice(index, match.index).trim())
			this.createComponentPart(match[1].toLowerCase(), match[2].trim(), this.parts.length)
			index = match.index + match[0].length
		}

		this.createTextPart(content.slice(index).trim())

		for (let i = 0; i < this.parts.length; ++i) {
			if (this.parts[i].component) {
				const cache = this.scaleCache[this.parts[i].id]
				if (cache) {
					this.parts[i].scale = cache.scale
					this.parts[i].mb = cache.mb
				}
			}
		}

		this.layout()
	}

	createTextPart(text: string) {
		this.parts.push({ text, id: this.partId(this.parts.length, text) })
	}

	createComponentPart(component: string, text: string, index: number) {
		this.parts.push({ component, text, id: this.partId(index, text, component), scale: 1, mb: 0 })
	}

	partId(index: number, text: string, component?: string) {
		return text + '-' + index + (component ? '-' + component : '')
	}

	layout() {
		setTimeout(() => {
			if (!this.width) {
				return
			}

			for (const part of this.parts) {
				if (part.component && part.scale === 1) {
					const width = part.component === 'pnj' ? 793 : 362

					if (width < this.width) {
						continue
					}

					part.scale = this.width / width
					const height = document.getElementById(part.id)!.offsetHeight
					part.mb = (-height * (1 - part.scale)) + 16

					this.scaleCache[part.id] = { scale: part.scale, mb: part.mb }
				}
			}
		}, 10)
	}
}
