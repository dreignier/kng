import { Component, ViewEncapsulation } from '@angular/core'
import { DatabaseService } from '../../database.service'
import { IconComponent } from '../../icon/icon.component'
import Npc from '../../model/npc'
import { NpcComponent } from '../../npc/npc.component'
import { showdownConverter } from '../../util'

@Component({
  selector: 'app-codex-generator-page',
  standalone: true,
  templateUrl: './codex-generator-page.component.html',
  styleUrls: ['./codex-generator-page.component.scss'],
	encapsulation: ViewEncapsulation.None,
	imports: [IconComponent, NpcComponent]
})
export class CodexGeneratorPageComponent {
	pages: Page[] = []
	converter = showdownConverter()

	constructor(
		readonly db: DatabaseService
	) {
		this.pages = [
			...this.db.npcs.map(npc => {
				const page = new BestiaryPage()

				page.title = 'Bestiaire'
				page.npc = npc
				page.description = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent semper orci elit, quis scelerisque odio mattis vel. Suspendisse nec mauris consequat, consequat nibh et, facilisis lacus. Integer a placerat felis. Morbi pellentesque velit risus, non placerat arcu hendrerit et. Pellentesque vitae tristique tortor. Aliquam erat volutpat. Cras at tristique elit, sed pulvinar neque. Suspendisse maximus lacus eget dictum finibus. Vestibulum pellentesque commodo ex, vel tempor erat faucibus non. Quisque dignissim vulputate ligula tincidunt gravida. Suspendisse potenti. Sed at consequat purus. Etiam pretium dignissim convallis. Proin tempus turpis quis metus mollis fermentum.

**Tactique :** Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent semper orci elit, quis scelerisque odio mattis vel. Suspendisse nec mauris consequat, consequat nibh et, facilisis lacus. Integer a placerat felis. Morbi pellentesque velit risus, non placerat arcu hendrerit et. Pellentesque vitae tristique tortor. Aliquam erat volutpat. Cras at tristique elit, sed pulvinar neque. Suspendisse maximus lacus eget dictum finibus. Vestibulum pellentesque commodo ex, vel tempor erat faucibus non. Quisque dignissim vulputate ligula tincidunt gravida. Suspendisse potenti. Sed at consequat purus. Etiam pretium dignissim convallis. Proin tempus turpis quis metus mollis fermentum.`

				page.quote = 'UN ====**NOCTE**==== NE LÂCHE RIEN, SES CROCS ====**DÉCHIRENT**==== MÊME LE ====**MÉTAL**===='
				page.author = 'GUIDE DU KNIGHT'
				page.elite = true
				page.incarnation = true

				return page
			})
		]

		setTimeout(() => {
			for (const page of this.pages) {
				page.layout()
			}
		}, 50)
	}

	isBestiaryPage(page: Page) {
		return page instanceof BestiaryPage
	}
}

const WIDTH = 793.7
const HEIGHT = 1122.52
const PADDING_BOTTOM = 48

class Page {
	static GLODAL_ID = 0
	id = `codex-element-${Page.GLODAL_ID++}`
	title: string = ''
	private _color: string = ''

	layout() {}

	element() {
		return document.getElementById(this.id)!
	}

	content() {
		return document.getElementById(`content-${this.id}`)!
	}

	get color() {
		return this._color
	}

	set color(color: string) {
		this._color = color
	}
}

class BestiaryPage extends Page {
	npc?: Npc
	npcScale = 1
	npcMarginBottom = 0
	description: string = ''
	quote: string = ''
	author: string = ''
	incarnation = false
	elite = false

	override get color() {
		return super.color || this.npc?.color || ''
	}

	npcComponent() {
		return document.getElementById(`npc-${this.id}`)!
	}

	override layout() {
		// Reset layout
		this.npcScale = 1
		this.npcMarginBottom = 0

		setTimeout(() => {
			const content = this.content()
			const npcComponent = this.npcComponent()

			const contentHeight = content.clientHeight
			const npcComponentHeight = npcComponent.clientHeight
			const overflow = contentHeight - (HEIGHT - PADDING_BOTTOM)

			if (overflow > 0) {
				const ratio = overflow / npcComponentHeight

				this.npcScale = 1 - ratio
				this.npcMarginBottom = -overflow
			}

			if (this.npcScale > 0.835) {
				this.npcScale = 0.835
				this.npcMarginBottom = -(npcComponentHeight * 0.165)
			}
		}, 50)
	}
}
