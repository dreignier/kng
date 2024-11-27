import { Component, HostListener, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { AutocompleteLibModule } from 'angular-ng-autocomplete'
import { isString } from 'lodash'
import { ColorPickerModule } from 'ngx-color-picker'
import { DatabaseService } from '../../database.service'
import { IconComponent } from '../../icon/icon.component'
import Npc from '../../model/npc'
import { NpcComponent } from '../../npc/npc.component'
import { arrayDown, arrayUp, showdownConverter } from '../../util'

@Component({
  selector: 'app-codex-generator-page',
  standalone: true,
  templateUrl: './codex-generator-page.component.html',
  styleUrls: ['./codex-generator-page.component.scss'],
	imports: [IconComponent, NpcComponent, FormsModule, ColorPickerModule, AutocompleteLibModule]
})
export class CodexGeneratorPageComponent implements OnInit {
	pages: Page[] = []
	summary = new SummaryPage()
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
		this.pages = [new CoverPage(), this.summary]
		this.fixIndex()
	}

	fixIndex() {
		for (let i = 0; i < this.pages.length; ++i) {
			this.pages[i].index = i
		}
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

	pageUp(page: Page) {
		arrayUp(this.pages, page, 1)
		this.fixIndex()
		this.onScroll()
	}

	pageDown(page: Page) {
		arrayDown(this.pages, page)
		this.fixIndex()
		this.onScroll()
	}

	pageRemove(page: Page) {
		this.pages = this.pages.filter(p => p !== page)
		this.vsTotal = this.pages.length * CONTAINER_HEIGHT
		this.fixIndex()
		this.onScroll()
	}

	npcFilter(items: Npc[], query: string) {
    return items.filter(e => e.name.toLowerCase().includes(query.toLowerCase()));
  }

	addBestiaryPage(index: number) {
		this.addPage(index, new BestiaryPage(this.db))
	}

	addTitlePage(index: number) {
		this.addPage(index, new TitlePage())
	}

	addStandardPage(index: number) {
		this.addPage(index, new StandardPage())
	}

	addPage(index: number, page: Page) {
		this.pages.splice(index + 1, 0, page)
		this.vsTotal = this.pages.length * CONTAINER_HEIGHT
		this.fixIndex()
		this.onScroll()
	}

	isBestiaryPage(page: Page) {
		return page instanceof BestiaryPage
	}

	isCoverPage(page: Page) {
		return page instanceof CoverPage
	}

	isSummaryPage(page: Page) {
		return page instanceof SummaryPage
	}

	isTitlePage(page: Page) {
		return page instanceof TitlePage
	}

	isStandardPage(page: Page) {
		return page instanceof StandardPage
	}
}

const HEIGHT = 1122.52
const PADDING_BOTTOM = 48
const CONTAINER_HEIGHT = 1138.52

class Page {
	static GLODAL_ID = 0
	id = `codex-element-${Page.GLODAL_ID++}`
	index: number = 0
	title: string = ''
	color: string = '#40bd97'

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
	author: string = ''

	constructor() {
		super()
		this.title = 'Codex Fan Made'
		this.color = '#ffffff'
	}
}

class SummaryPage extends Page {
	constructor() {
		super()
		this.title = 'Sommaire'
	}
}

class TitlePage extends Page {
	constructor() {
		super()
		this.title = 'Titre de la page'
		this.color = '#ffffff'
	}
}

class StandardPage extends Page {
	header = ''
	subTitle = ''
	text = ''

	constructor() {
		super()
		this.title = 'Titre de la page'
		this.color = '#40bd97'
	}
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

	constructor(
		readonly db: DatabaseService
	) {
		super()

		this.title = 'Bestiaire'
		this.description = `Ceci est un texte d'exemple pour vous montrer ce qui est possible de faire.

# Ceci est un titre

## Ceci est un sous titre

---

>>Ce texte est centré<<

*Ce texte est en italique*

**Ce texte est en gras**

__Ce texte est souligné__

~~Ce texte est barré~~

==Ce texte est gros==

===Ce texte est encore plus gros===

====Ce texte est le plus gros possible====

@@Ce texte est un lien@@

>>**Il est possible de combiner les effets**<<

Vous pouvez faire des listes :
* **N'hésitez** pas à __utiliser__ les *effets*
* Cela fonctionne même au ==milieu des phrases==
* Vous pouvez aussi surelever du texte avec ^^cet effet^^

Les listes peuvent aussi être numérotées :
1. Si vous avez besoin d'aide, n'hésitez pas à demander sur le serveur discord de Knight
2. Des personnes vous aiderons
3. **__Bonne écriture !__**
`

		this.quote = 'NE PERDEZ JAMAIS ====ESPOIR==== FACE À ====L\'ANATHÈME===='
		this.author = 'GUIDE DU KNIGHT'
	}

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
