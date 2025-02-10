import { Component, HostListener, OnDestroy, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { AutocompleteLibModule } from 'angular-ng-autocomplete'
import { isString, omit } from 'lodash'
import { ColorPickerModule } from 'ngx-color-picker'
import { Subscription } from 'rxjs'
import { CodexContentComponent } from '../../codex-content/codex-content.component'
import { DatabaseService } from '../../database.service'
import { DialogService } from '../../dialog/dialog.service'
import { IconComponent } from '../../icon/icon.component'
import { Character } from '../../model/character'
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
export class CodexGeneratorPageComponent implements OnInit, OnDestroy {
	pages: Page[] = []
	summary = new SummaryPage()
	displayedPages: Page[] = []
	printMode = false
	vsStart = 0
	vsBefore = 0
	vsAfter = 0
	vsTotal = 0
	dbSubscription: Subscription
	helpers = [
		{ icon: 'bold', help: '**{0}**', default: 'Texte en gras' },
		{ icon: 'italic', help: '*{0}*', default: 'Texte en italique' },
		{ icon: 'underline', help: '__{0}__', default: 'Texte souligné' },
		{ icon: 'strike', help: '~~{0}~~', default: 'Texte barré' },
		{ icon: 'sup', help: '^^{0}^^', default: 'Texte surélevé' },
		{ icon: 'h1', help: '\n\n# {0}\n\n', default: 'Titre de niveau 1' },
		{ icon: 'h2', help: '\n\n## {0}\n\n', default: 'Titre de niveau 2' },
		{ icon: 'h3', help: '\n\n### {0}\n\n', default: 'Titre de niveau 3' },
		{ icon: 'sparkles', help: '=={0}==', default: 'Texte en couleur' },
		{ icon: 'sparkles', help: '==={0}===', default: 'Texte en couleur plus gros' },
		{ icon: 'sparkles', help: '===={0}====', default: 'Texte en couleur encore plus gros' },
		{ icon: 'sparkles', help: '============{0}============', default: 'Texte en couleur le plus gros possible' },
		{ icon: 'zoom-out', help: '!!!{0}!!!', default: 'Gros texte' },
		{ icon: 'zoom-out', help: '!!!!{0}!!!!', default: 'Texte encore plus gros' },
		{ icon: 'zoom-out', help: '!!!!!!!!!!!!{0}!!!!!!!!!!!!', default: 'Texte le plus gros possible' },
		{ icon: 'link', help: '@@{0}@@', default: 'Lien' },
		{ icon: 'align-center', help: '>>{0}<<', default: 'Texte centré' },
		{ icon: 'align-right', help: '>>{0}>>', default: 'Texte aligné à droite' },
		{ icon: 'ul', help: '\n* {0}', default: 'Liste' },
		{ icon: 'ol', help: '\n1. {0}', default: 'Liste numérotée' },
		{ icon: 'column', help: '\n\n||||\n\n', default: 'Nouvelle colonne' },
		{ icon: 'section', help: '\n\n____\n\n', default: 'Nouvelle section' },
		{ icon: 'section', help: '\n\n____vvv\n\n', default: 'Nouvelle section en pieds de page' },
		{ icon: 'panel', help: '\n\n{{{\n\n##Titre\n\n{0}\n}}}\n\n', default: "Contenu de l'encadré" },
		{ icon: 'panel', help: '\n\n{{{{\n\n##Titre\n\n{0}\n}}}}\n\n', default: "Contenu de l'encadré" },
		{ icon: 'margin-left', help: '<<<{0}<<<', default: 'LdB – p. XX', title: 'Émargement gauche' },
		{ icon: 'margin-right', help: '>>>{0}>>>', default: 'LdB – p. XX', title: 'Émargement droite' },
		{ icon: 'badge', help: '((({0})))', default: '100', title: 'Badge' },
		{ icon: 'badge', help: '(((({0}))))', default: '100', title: 'Gros badge' },
		{ icon: 'table', help: '\n\n[[[\nLigne 1 ||: Valeur 1\n---\nLigne 2 ||: Valeur 2\n---\nLigne 3 ||: Valeur 3\n]]]\n\n', default: 'Tableau' },
		{ icon: 'table', help: '\n\n[[[<\nLigne 1 ||: Valeur 1\n---\nLigne 2 ||: Valeur 2\n---\nLigne 3 ||: Valeur 3\n]]]\n\n', default: 'Tableau centré' },
		{ icon: 'table', help: '\n\n[[[>\nLigne 1 ||: Valeur 1\n---\nLigne 2 ||: Valeur 2\n---\nLigne 3 ||: Valeur 3\n]]]\n\n', default: 'Tableau à droite' },
		{ icon: 'table', help: '\n\n[[[=\nTitre du tableau\n---\nColonne 1 || Colonne 2 || Colonne 3\n---\n: Valeur 1 ||: Valeur 2 ||: Valeur 3\n]]]\n\n', default: 'Tableau large' },
		{ icon: 'img', help: '![{0}](https://kng.magusgeek.com/assets/favicon-32x32.png)', default: 'Image' },
		{ icon: 'equipment', help: '[equ:{0}]', default: 'Équipement', title: 'Équipement' },
		{ icon: 'vehicle', help: '[veh:{0}]', default: 'Véhicule', title: 'Véhicule' },
		{ icon: 'npc', help: '[pnj:{0}]', default: 'PNJ', title: 'PNJ' }
	]

	constructor(
		readonly db: DatabaseService,
		private dialog: DialogService
	) {
		if (this.db.npcs?.length) {
			this.helpers.find((h) => h.icon === 'npc')!.help = `[pnj:${this.db.npcs[0].name}]`
		}

		if (this.db.equipments?.length) {
			this.helpers.find((h) => h.icon === 'equipment')!.help = `[equ:${this.db.equipments[0].name}]`
		}

		if (this.db.vehicles?.length) {
			this.helpers.find((h) => h.icon === 'vehicle')!.help = `[veh:${this.db.vehicles[0].name}]`
		}

		this.load()

		if (!this.pages.length) {
			this.pages = [new CoverPage(), this.summary]
		}

		this.fixIndex()
		this.generateSummary()
		this.save()

		setInterval(() => {
			this.generateSummary()
			this.save()
		}, 5000)

		this.dbSubscription = this.db.change.subscribe(() => {
			this.save()
			this.load()
			this.fixIndex()
		})
	}

	ngOnDestroy(): void {
		this.dbSubscription.unsubscribe()
	}

	save() {
		this.db.saveCodex(this.pages.map((p) => p.toPlain()))
	}

	load(data?: any) {
		try {
			const json = data || this.db.loadCodex()
			if (json) {
				const plain = JSON.parse(json)
				this.pages = plain.map((p: any) => this.fromPlain(p))
				this.summary = <SummaryPage>this.pages[1]
			}
		} catch (e) {
			console.error(e)
		}
	}

	download() {
		const json = JSON.stringify(this.pages.map((p) => p.toPlain()))
		const blob = new Blob([json], { type: 'application/json' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = (this.pages[0].title || 'codex') + '.json'
		a.click()
		URL.revokeObjectURL(url)
	}

	upload(event: Event) {
		const input = <HTMLInputElement>event.target
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
				this.generateSummary()

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

	helper(element: HTMLTextAreaElement, help: { icon: string; help: string; default: string }) {
		const start = element.selectionStart
		const end = element.selectionEnd
		const text = element.value
		const before = text.substring(0, start)
		const after = text.substring(end, text.length)
		const selected = text.substring(start, end)
		let helpText = help.help.replace('{0}', selected.trim() ? selected : help.default)

		element.value = before + helpText + after
		element.selectionStart = start + helpText.length
		element.selectionEnd = start + helpText.length
		element.focus()

		element.dispatchEvent(new Event('input', { bubbles: true }))
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
		this.generateSummary()
	}

	toggleSecondLevel() {
		this.summary.includeSecondLevel = !this.summary.includeSecondLevel
		this.generateSummary()
	}

	generateSummary() {
		this.pages = this.pages.filter((p) => !(p instanceof SummarySecondaryPage))
		const secondarySummaryPages = this.summary.generate(this.pages)
		this.pages.splice(2, 0, ...secondarySummaryPages)
		this.fixIndex()
		this.vsTotal = this.pages.length * CONTAINER_HEIGHT
	}

	set summaryColor(color: string) {
		this.summary.color = color

		for (let i = 2; i < this.pages.length && this.pages[i] instanceof SummarySecondaryPage; ++i) {
			this.pages[i].color = color
		}
	}

	get summaryColor() {
		return this.summary.color
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
		if (!page.movable() || !this.pages[page.index - 1]?.movable()) {
			return
		}

		arrayUp(this.pages, page)
		this.generateSummary()
		this.fixIndex()
		this.onScroll()
	}

	pageDown(page: Page) {
		if (!page.movable() || !this.pages[page.index + 1]?.movable()) {
			return
		}

		arrayDown(this.pages, page)
		this.generateSummary()
		this.fixIndex()
		this.onScroll()
	}

	reset() {
		this.dialog.confirm(`Voulez vous vraiment réinitialiser le codex ? Le codex en cours sera définitivement perdu si vous ne l'avez pas sauvegardé.`).subscribe(() => {
			this.pages = [new CoverPage(), this.summary]
			this.generateSummary()
			this.vsTotal = this.pages.length * CONTAINER_HEIGHT
			this.fixIndex()
			this.onScroll()
		})
	}

	pageRemove(page: Page) {
		if (!page.deletable()) {
			return
		}

		this.dialog.confirm(`Voulez vous vraiment supprimer cette page ?`).subscribe(() => {
			this.pages = this.pages.filter((p) => p !== page)
			this.vsTotal = this.pages.length * CONTAINER_HEIGHT
			this.generateSummary()
			this.fixIndex()
			this.onScroll()
		})
	}

	npcFilter(items: Npc[], query: string) {
		return items.filter((e) => e.name.toLowerCase().includes(query.toLowerCase()))
	}

	characterFilter(items: Character[], query: string) {
		return items.filter((e) => e.name.toLowerCase().includes(query.toLowerCase()))
	}

	addBestiaryPage(index: number) {
		this.addPage(index, new BestiaryPage(this.db))
	}

	addCharacterPage(index: number) {
		this.addPage(index, new CharacterPage(this.db))
	}

	addTitlePage(index: number) {
		this.addPage(index, new TitlePage())
	}

	addStandardPage(index: number) {
		this.addPage(index, new StandardPage(this.db))
	}

	addPage(index: number, page: Page) {
		if (!this.pages[index].canInsertAfter()) {
			return
		}

		this.pages.splice(index + 1, 0, page)
		this.vsTotal = this.pages.length * CONTAINER_HEIGHT
		this.fixIndex()
		this.onScroll()
	}

	isBestiaryPage(page: Page) {
		return page instanceof BestiaryPage
	}

	isCharacterPage(page: Page) {
		return page instanceof CharacterPage
	}

	isCoverPage(page: Page) {
		return page instanceof CoverPage
	}

	isSummaryPage(page: Page) {
		return page instanceof SummaryPage
	}

	isSummarySecondaryPage(page: Page) {
		return page instanceof SummarySecondaryPage
	}

	isTitlePage(page: Page) {
		return page instanceof TitlePage
	}

	isStandardPage(page: Page) {
		return page instanceof StandardPage
	}

	fromPlain(plain: any) {
		const klass = <keyof typeof constructors>plain.klass

		if (!constructors[klass]) {
			throw new Error(`Unknown class ${klass}`)
		}

		const page = new constructors[klass](this.db)
		page.fromPlain(omit(plain, 'klass'))

		return page
	}
}

const HEIGHT = 1122.52
const PADDING_BOTTOM = 40
const CONTAINER_HEIGHT = HEIGHT + 30

class Page {
	static GLODAL_ID = 0
	id = `codex-element-${Page.GLODAL_ID++}`
	index: number = 0
	title: string = ''
	color: string = '#40bd97'
	klassName: string = 'Page'
	dark = false
	background = ''

	onChange() {
		this.layout()
	}

	deletable() {
		return true
	}

	movable() {
		return true
	}

	canInsertAfter() {
		return true
	}

	layout() {}

	element() {
		return document.getElementById(this.id)!
	}

	content() {
		return document.getElementById(`content-${this.id}`)!
	}

	toggleDarkMode() {
		this.dark = !this.dark
	}

	toPlain(): any {
		const result = <any>{ ...this, klass: this.klassName }

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
	override klassName = 'CoverPage'
	author: string = ''

	constructor() {
		super()
		this.title = 'Codex Fan Made'
		this.color = '#ffffff'
		this.dark = true
	}

	override deletable() {
		return false
	}

	override movable() {
		return false
	}

	override canInsertAfter() {
		return false
	}
}

class SummaryPage extends Page {
	override klassName = 'SummaryPage'
	elements: { title: string; level: number; page: number; color: string }[][] = []
	includeNpc = false
	includeSecondLevel = false
	columnWidth = 660
	secondaryPages = 0

	constructor() {
		super()
		this.title = 'Table des matières'
	}

	override deletable() {
		return false
	}

	override movable() {
		return false
	}

	override canInsertAfter() {
		return !this.secondaryPages
	}

	generate(pages: Page[]) {
		const elements: { title: string; level: number; page: number; color: string }[] = []

		for (const page of pages) {
			if (page instanceof TitlePage) {
				elements.push({ title: page.title, level: 0, page: page.index, color: page.color })
			} else if (page instanceof StandardPage) {
				for (const match of Array.from(page.text.matchAll(/^([#]+) ?(.*)$/gm))) {
					if (match[1].length > 2 || (match[1].length === 2 && !this.includeSecondLevel)) {
						continue
					}

					elements.push({ title: match[2], level: match[1].length, page: page.index, color: page.color })
				}
			} else if (page instanceof BestiaryPage) {
				if (this.includeNpc && page.npcName) {
					elements.push({ title: page.npcName, level: 1, page: page.index, color: page.color })
				}
			}
		}

		if (elements.length) {
			const minLevel = Math.min(...elements.map((e) => e.level))
			if (minLevel !== 0) {
				for (const element of elements) {
					element.level -= minLevel
				}
			}

			if (elements[0].level !== 0) {
				const shift = elements[0].level
				for (let i = 0; i < elements.length && elements[i].level !== 0; ++i) {
					elements[i].level -= shift
				}
			}
		}

		this.elements = []
		for (let i = 0; i < elements.length; i += 35) {
			this.elements.push(elements.slice(i, i + 35))
		}

		const secondaryPages: SummarySecondaryPage[] = []
		for (let i = 2; i < this.elements.length; i += 2) {
			const page = new SummarySecondaryPage()
			page.elements = this.elements.slice(i, i + 2)
			page.color = this.color
			page.dark = this.dark
			page.columnWidth = (660 - 20 * (page.elements.length - 1)) / page.elements.length
			secondaryPages.push(page)
		}
		this.elements = this.elements.slice(0, 2)

		this.columnWidth = (660 - 20 * (this.elements.length - 1)) / this.elements.length

		this.secondaryPages = secondaryPages.length

		if (this.secondaryPages) {
			secondaryPages[secondaryPages.length - 1].last = true
		}

		if (this.secondaryPages) {
			for (const column of this.elements) {
				for (const element of column) {
					element.page += this.secondaryPages
				}
			}

			for (const page of secondaryPages) {
				for (const column of page.elements) {
					for (const element of column) {
						element.page += this.secondaryPages
					}
				}
			}
		}

		return secondaryPages
	}

	override toPlain() {
		const result = super.toPlain()

		delete result.elements

		return result
	}

	override fromPlain(data: any) {
		super.fromPlain(data)
		this.title = 'Table des matières'
	}
}

class SummarySecondaryPage extends Page {
	override klassName = 'SummarySecondaryPage'
	elements: { title: string; level: number; page: number; color: string }[][] = []
	columnWidth = 660
	last = false

	constructor() {
		super()
		this.title = 'Sommaire'
	}

	override deletable() {
		return false
	}

	override movable() {
		return false
	}

	override canInsertAfter() {
		return this.last
	}
}

class TitlePage extends Page {
	override klassName = 'TitlePage'

	constructor() {
		super()
		this.title = 'Titre de la page'
		this.color = '#ffffff'
		this.dark = true
	}
}

class StandardPage extends Page {
	override klassName = 'StandardPage'
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

[equ:${db.equipments[0].name}]

`
		}

		const vehicle = db.vehicles[0]
		if (vehicle) {
			this.text += `Et vous pouvez insérez un véhicule dans votre texte comme ceci :

[veh:${db.vehicles[0].name}]

`
		}

		this.text += `Cet exemple ne montre pas toutes les possibilités, n'hésitez pas à demander de l'aide sur le Discord de Knight.`
	}
}

class BestiaryPage extends Page {
	override klassName = 'BestiaryPage'
	npcName: string = ''
	npcScale = 1
	npcMarginBottom = 0
	description: string = ''
	quote: string = ''
	incarnation = false
	elite = false
	twoColumns = false
	npc?: Npc

	constructor(readonly db: DatabaseService) {
		super()

		this.title = 'Bestiaire'
		this.description = `Ceci est un texte d'exemple pour la description du PNJ. Vous pouvez utiliser des **effets** sur votre texte.

**Tactique :** N'hésitez pas à __utiliser__ et à *__combiner__* les effets.`

		this.quote = `>>*====« ====Votre ====ESPOIR==== est votre meilleure arme.==== »====*<<\n>>— ARTHUR>>`

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
			this.npcScale = Math.round((this.npcScale + Number.EPSILON) * 100) / 100

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
		}, 50)
	}
}

class CharacterPage extends Page {
	override klassName = 'CharacterPage'
	characterName: string = ''
	character?: Character

	constructor(readonly db: DatabaseService) {
		super()

		this.title = 'Personnage'
	}

	override toPlain() {
		const result = super.toPlain()

		delete result.db
		delete result.character

		return result
	}

	override fromPlain(plain: any) {
		this.title = ''
		this.character = undefined
		this.characterName = ''

		super.fromPlain(plain)
		this.setCharacterName(this.characterName)
	}

	setCharacterName(name: string) {
		this.characterName = name
		this.setCharacter(this.db.findCharacter(name))
	}

	setCharacter(character?: Character) {
		if (character !== this.character) {
			this.character = character
			this.color = this.character?.color || '#40bd97'
			this.background = this.character?.bgImage || ''
			this.dark = this.character?.dark !== undefined ? this.character.dark : true
			this.layout()
		}
	}

	onCharacterNameChange(name: string) {
		this.setCharacter(this.db.findCharacter(name))
	}

	onCharacterSelected(character: Character | string) {
		if (isString(character)) {
			this.setCharacterName(character)
		} else {
			this.characterName = character.name
			this.setCharacter(character)
		}
	}
}

const constructors = {
	CoverPage,
	SummaryPage,
	TitlePage,
	StandardPage,
	BestiaryPage,
	SummarySecondaryPage,
	CharacterPage
}
