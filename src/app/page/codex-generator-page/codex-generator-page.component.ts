import { Component, HostListener, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { AutocompleteLibModule } from 'angular-ng-autocomplete'
import { isString } from 'lodash'
import { ColorPickerModule } from 'ngx-color-picker'
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
	imports: [IconComponent, NpcComponent, FormsModule, ColorPickerModule, AutocompleteLibModule]
})
export class CodexGeneratorPageComponent implements OnInit {
	pages: Page[] = []
	displayedPages: Page[] = []
	converter = showdownConverter()
	printMode = false
	vsStart = 0
	vsBefore = 0
	vsAfter = 0
	vsTotal = 0

	constructor(
		readonly db: DatabaseService
	) {
		this.pages = [
			...this.db.npcs.map(npc => {
				const page = new BestiaryPage(this.db)

				page.title = 'Bestiaire'
				page.npcName = npc.name
				page.npc = npc
				page.color = npc.color
				page.description = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent semper orci elit, quis scelerisque odio mattis vel. Suspendisse nec mauris consequat, consequat nibh et, facilisis lacus. Integer a placerat felis. Morbi pellentesque velit risus, non placerat arcu hendrerit et. Pellentesque vitae tristique tortor. Aliquam erat volutpat. Cras at tristique elit, sed pulvinar neque. Suspendisse maximus lacus eget dictum finibus. Vestibulum pellentesque commodo ex, vel tempor erat faucibus non. Quisque dignissim vulputate ligula tincidunt gravida. Suspendisse potenti. Sed at consequat purus. Etiam pretium dignissim convallis. Proin tempus turpis quis metus mollis fermentum.

**Tactique :** Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent semper orci elit, quis scelerisque odio mattis vel. Suspendisse nec mauris consequat, consequat nibh et, facilisis lacus. Integer a placerat felis. Morbi pellentesque velit risus, non placerat arcu hendrerit et. Pellentesque vitae tristique tortor. Aliquam erat volutpat. Cras at tristique elit, sed pulvinar neque. Suspendisse maximus lacus eget dictum finibus. Vestibulum pellentesque commodo ex, vel tempor erat faucibus non. Quisque dignissim vulputate ligula tincidunt gravida. Suspendisse potenti. Sed at consequat purus. Etiam pretium dignissim convallis. Proin tempus turpis quis metus mollis fermentum.`

				page.quote = 'UN ====**NOCTE**==== NE LÂCHE RIEN, SES CROCS ====**DÉCHIRENT**==== MÊME LE ====**MÉTAL**===='
				page.author = 'GUIDE DU KNIGHT'
				page.elite = false
				page.incarnation = false
				page.twoColumns = false

				return page
			})
		]
	}

	ngOnInit(): void {
		this.vsTotal = this.pages.length * CONTAINER_HEIGHT
		this.vsStart = document.getElementById('vs-start')!.offsetTop

		this.onScroll()
	}

	@HostListener('window:scroll')
	onScroll() {
		const screenTop = document.documentElement.scrollTop
		const screenBottom = screenTop + window.innerHeight

		let startIndex = Math.floor(Math.max(0, screenTop - CONTAINER_HEIGHT) / CONTAINER_HEIGHT)
		let endIndex = Math.ceil(Math.min(this.vsStart + this.vsTotal, screenBottom + CONTAINER_HEIGHT) / CONTAINER_HEIGHT)

		if (endIndex > this.pages.length) {
			endIndex = this.pages.length
		}

		const old = this.displayedPages
		this.displayedPages = this.pages.slice(startIndex, endIndex)

		this.vsBefore = startIndex * CONTAINER_HEIGHT
		this.vsAfter = (this.pages.length - endIndex) * CONTAINER_HEIGHT

		for (const page of this.displayedPages) {
			if (!old.includes(page)) {
				page.layout()
			}
		}
	}

	isBestiaryPage(page: Page) {
		return page instanceof BestiaryPage
	}

	npcFilter(items: Npc[], query: string) {
    return items.filter(e => e.name.toLowerCase().includes(query.toLowerCase()));
  }
}

const HEIGHT = 1122.52
const PADDING_BOTTOM = 48
const CONTAINER_HEIGHT = 1138.52

class Page {
	static GLODAL_ID = 0
	id = `codex-element-${Page.GLODAL_ID++}`
	title: string = ''
	color: string = ''

	constructor(
		readonly db: DatabaseService
	) {}

	onChange() {
		this.layout()
	}

	layout() {}

	element() {
		return document.getElementById(this.id)!
	}

	content() {
		return document.getElementById(`content-${this.id}`)!
	}
}

class CoverPage extends Page {

}

class SummaryPage extends Page {

}

class BestiaryPage extends Page {
	npcName: string = ''
	npcScale = 1
	npcMarginBottom = 0
	description: string = ''
	quote: string = ''
	author: string = ''
	incarnation = false
	elite = false
	twoColumns = false
	npc?: Npc

	setNpcName(name: string) {
		this.npcName = name
		this.setNpc(this.db.npcs.find(npc => npc.name === name))
	}

	setNpc(npc?: Npc) {
		this.npc = npc
		this.color = this.npc?.color || '#40bd97'
	}

	onNpcNameChange(name: string) {
		this.setNpcName(name)
		this.layout()
	}

	onNpcSelected(npc: Npc | string) {
		if (isString(npc)) {
			this.setNpcName(npc)
		} else {
			this.setNpc(npc)
		}

		this.layout()
	}

	npcComponent() {
		return document.getElementById(`npc-${this.id}`)!
	}

	descriptionComponent() {
		return document.getElementById(`description-${this.id}`)!
	}

	changeTwoColumns() {
		this.twoColumns = !this.twoColumns
		this.npcScale = 1
		this.npcMarginBottom = 0
		this.layout()
	}

	override layout() {
		setTimeout(() => {
			const content = this.content()
			const npcComponent = this.npcComponent()

			if (!content || !npcComponent) {
				return
			}

			const contentHeight = content.clientHeight
			const overflow = contentHeight - (HEIGHT - PADDING_BOTTOM)

			if (Math.abs(overflow) < 10) {
				return
			}

			const npcComponentHeight = npcComponent.clientHeight
			this.npcScale -= overflow / npcComponentHeight

			if (this.twoColumns) {
				const descriptionComponentHeight = this.descriptionComponent().clientHeight
				if (npcComponentHeight * this.npcScale < descriptionComponentHeight) {
					this.npcScale = descriptionComponentHeight / npcComponentHeight
				}

				if (this.npcScale > 0.565) {
					this.npcScale = 0.565
				}
			} else {
				if (this.npcScale > 0.835) {
					this.npcScale = 0.835
				}
			}

			if (this.npcScale < 0.1) {
				this.npcScale = 0.1
			}

			this.npcMarginBottom = -(npcComponentHeight * (1 - this.npcScale))
		}, 10)
	}
}
