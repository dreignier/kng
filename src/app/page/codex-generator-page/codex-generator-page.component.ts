import { Component, HostListener, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { AutocompleteLibModule } from 'angular-ng-autocomplete'
import { isString, omit } from 'lodash'
import { ColorPickerModule } from 'ngx-color-picker'
import { CodexContentComponent } from '../../codex-content/codex-content.component'
import { DatabaseService } from '../../database.service'
import { IconComponent } from '../../icon/icon.component'
import Npc from '../../model/npc'
import { NpcComponent } from '../../npc/npc.component'
import { arrayDown, arrayUp } from '../../util'

@Component({
  selector: 'app-codex-generator-page',
  standalone: true,
  templateUrl: './codex-generator-page.component.html',
  styleUrls: ['./codex-generator-page.component.scss'],
	imports: [IconComponent, NpcComponent, FormsModule, ColorPickerModule, AutocompleteLibModule, CodexContentComponent]
})
export class CodexGeneratorPageComponent implements OnInit {
	pages: Page[] = []
	summary = new SummaryPage()
	displayedPages: Page[] = []
	printMode = false
	vsStart = 0
	vsBefore = 0
	vsAfter = 0
	vsTotal = 0

	constructor(
		readonly db: DatabaseService
	) {
		this.load()

		if (!this.pages.length) {
			this.pages = [new CoverPage(), this.summary]
		}

		this.fixIndex()
		this.summary.generate(this.pages)
		this.save()

		setInterval(() => {
			this.summary.generate(this.pages)
			this.save()
		}, 5000)
	}

	save() {
		const json = JSON.stringify(this.pages.map(p => p.toPlain()))
		localStorage.setItem('codex', json)
	}

	load(data?: any) {
		try {
			const json = data || localStorage.getItem('codex')
			if (json) {
				const plain = JSON.parse(json)
				this.pages = plain.map((p: any) => this.fromPlain(p))
				this.summary = <SummaryPage> this.pages[1]
			}
		} catch (e) {
			console.error(e)
		}
	}

	download() {
		const json = JSON.stringify(this.pages.map(p => p.toPlain()))
		const blob = new Blob([json], { type: 'application/json' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = (this.pages[0].title || 'codex') + '.json'
		a.click()
		URL.revokeObjectURL(url)
	}

	upload(event: Event) {
		const input = <HTMLInputElement> event.target
		const file = input.files?.[0]

		if (!file) {
			return
		}

		const reader = new FileReader()

		reader.onload = () => {
			try {
				this.load(reader.result)
				this.vsTotal = this.pages.length * CONTAINER_HEIGHT
				this.fixIndex()
				this.summary.generate(this.pages)

				if (!this.printMode) {
					this.onScroll()
				} else {
					for (const page of this.pages) {
						page.layout()
					}
				}

				this.save()
			} catch (e) {
				console.error(e)
			}
		}

		reader.readAsText(file)
		input.value = ''
	}

	togglePrintMode() {
		if (this.printMode) {
			this.printMode = false
			this.onScroll()
		} else {
			this.printMode = true
			this.vsBefore = 0
			this.vsAfter = 0
			this.displayedPages = this.pages
			for (const page of this.pages) {
				page.layout()
			}
		}
	}

	toggleSummaryNpc() {
		this.summary.includeNpc = !this.summary.includeNpc
		this.summary.generate(this.pages)
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
		if (this.printMode) {
			return
		}

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
    return items.filter(e => e.name.toLowerCase().includes(query.toLowerCase()))
  }

	addBestiaryPage(index: number) {
		this.addPage(index, new BestiaryPage(this.db))
	}

	addTitlePage(index: number) {
		this.addPage(index, new TitlePage())
	}

	addStandardPage(index: number) {
		this.addPage(index, new StandardPage(this.db))
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

	fromPlain(plain: any) {
		const klass = <keyof typeof constructors> plain.klass

		if (!constructors[klass]) {
			throw new Error(`Unknown class ${klass}`)
		}

		const page = new (constructors[klass])(this.db)
		page.fromPlain(omit(plain, 'klass'))

		return page
	}
}

const HEIGHT = 1122.52
const PADDING_BOTTOM = 48
const CONTAINER_HEIGHT = HEIGHT + 30

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

	toPlain(): any {
		const result = <any> { ...this, klass: this.constructor.name }

		delete result.id
		delete result.index

		return result
	}

	fromPlain(plain: any) {
		this.title = ''
		Object.assign(this, plain)
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
	elements: { title: string, level: number, page: number }[][] = []
	includeNpc = false
	columnWidth = 660

	constructor() {
		super()
		this.title = 'Sommaire'
	}

	generate(pages: Page[]) {
		const elements: { title: string, level: number, page: number }[] = []

		for (const page of pages) {
			if (page instanceof TitlePage) {
				elements.push({ title: page.title, level: 0, page: page.index })
			} else if (page instanceof StandardPage) {
				for (const match of Array.from(page.text.matchAll(/^# (.*)$/gm))) {
					elements.push({ title: match[1], level: 1, page: page.index })
				}
			} else if (page instanceof BestiaryPage) {
				if (this.includeNpc && page.npcName) {
					elements.push({ title: page.npcName, level: 1, page: page.index })
				}
			}
		}

		this.elements = []
		for (let i = 0; i < elements.length; i += 30) {
			this.elements.push(elements.slice(i, i + 30))
		}

		this.columnWidth = (660 - (20 * (this.elements.length - 1))) / this.elements.length
	}

	override toPlain() {
		const result = super.toPlain()

		delete result.elements

		return result
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
	text = ''

	constructor(db: DatabaseService) {
		super()
		this.title = 'Titre de la page'
		this.color = '#40bd97'

		this.text = `
Ceci est un texte d'exemple pour vous montrer ce qui est possible de faire.

# Ceci est un titre
____

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
* Vous pouvez aussi surélever du texte avec ^^cet effet^^

Les listes peuvent aussi être numérotées :
1. Si vous avez besoin d'aide, n'hésitez pas à demander sur le serveur discord de Knight
2. Des personnes vous aiderons
3. **__Bonne écriture !__**

Il est possible de faire plusieurs colonnes en utilisant :
||||

Le texte situé après sera dans une autre colonne.`

	const equipment = db.equipments[0]
	if (equipment) {
		this.text += `Vous pouvez insérer un équipement dans votre page en faisant ceci :

[equ:accélérateur]

`
	}

	const vehicle = db.vehicles[0]
	if (vehicle) {
		this.text += `Et vous pouvez insérez un véhicule dans votre texte comme ceci :

[veh:gros truc]

`
	}

	this.text += `Cet exemple ne montre pas toutes les possibilités, n'hésitez pas à demander de l'aide sur le Discord de Knight.`
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
		this.description = `Ceci est un texte d'exemple pour la description du PNJ. Vous pouvez utiliser des **effets** sur votre texte.

**Tactique :** N'hésitez pas à __utiliser__ et à *__combiner__* les effets.`

		this.quote = '>>*====« ====Votre ====ESPOIR==== est votre meilleure arme.==== »====*<<'
		this.author = 'ARTHUR'

		if (this.db.npcs[0]) {
			this.setNpcName(this.db.npcs[0].name)
		}
	}

	override toPlain() {
		const result = super.toPlain()

		delete result.db
		delete result.npc
		delete result.npcScale
		delete result.npcMarginBottom

		return result
	}

	override fromPlain(plain: any) {
		this.title = ''
		this.description = ''
		this.quote = ''
		this.author = ''
		this.npc = undefined
		this.npcName = ''

		super.fromPlain(plain)
		this.setNpcName(this.npcName)
	}

	setNpcName(name: string) {
		this.npcName = name
		this.setNpc(this.db.findNpc(name))
	}

	setNpc(npc?: Npc) {
		if (npc !== this.npc) {
			this.npc = npc
			this.color = this.npc?.color || '#40bd97'
			this.layout()
		}
	}

	onNpcNameChange(name: string) {
		this.setNpc(this.db.findNpc(name))
	}

	onNpcSelected(npc: Npc | string) {
		if (isString(npc)) {
			this.setNpcName(npc)
		} else {
			this.npcName = npc.name
			this.setNpc(npc)
		}
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

const constructors = {
	CoverPage,
	SummaryPage,
	TitlePage,
	StandardPage,
	BestiaryPage
}
