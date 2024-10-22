import { SecurityContext } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'
import { isString } from 'lodash'
import { arrayDown, arrayUp } from '../util'
import Entity from './entity'

const WIDTH = 1080
const GAP = 20
const MIN_WIDTH = 200

export type NewsSlider = { value: number; actual: number; min: number; max: number; colA: NewsColumn; colB: NewsColumn }

export default class News extends Entity {
	columns: NewsColumn[] = [new NewsColumn(), new NewsColumn(), new NewsColumn()]
	sliders: NewsSlider[] = []

	constructor(data?: any) {
		super()

		if (data) {
			this.import(data)
		}

		this.recomputeSliders()
	}

	recomputeSliders() {
		let left = 0

		for (let i = 0; i < this.columns.length - 1; ++i) {
			left += this.columns[i].width
			const value = left + GAP / 2

			if (!this.sliders[i]) {
				this.sliders.push({ value, actual: value, min: 0, max: WIDTH, colA: this.columns[i], colB: this.columns[i + 1] })
			} else {
				const slider = this.sliders[i]
				slider.value = value
				slider.actual = value
				slider.colA = this.columns[i]
				slider.colB = this.columns[i + 1]
			}

			this.clampSlider(this.sliders[i])

			left += GAP
		}
	}

	clampSlider(slider: NewsSlider) {
		slider.min = slider.value - (slider.colA.width - MIN_WIDTH)
		slider.max = slider.value + (slider.colB.width - MIN_WIDTH)
	}

	slider(slider: NewsSlider) {
		let colA!: NewsColumn
		let colB!: NewsColumn
		let diff = 0
		let neighbor: NewsSlider | undefined

		if (slider.value < slider.actual) {
			colA = slider.colA
			colB = slider.colB
			diff = slider.actual - slider.value
			neighbor = this.sliders[this.sliders.indexOf(slider) - 1]
		} else {
			colA = slider.colB
			colB = slider.colA
			diff = slider.value - slider.actual
			neighbor = this.sliders[this.sliders.indexOf(slider) + 1]
		}

		colA.width -= diff
		colB.width += diff

		slider.actual = slider.value

		if (neighbor) {
			this.clampSlider(neighbor)
		}

		this.fixWidth()
	}

	import(data: any) {
		this.name = isString(data.name) ? data.name : ''
		this.columns = Array.isArray(data.columns) ? data.columns.map((data: any) => new NewsColumn(data)) : [new NewsColumn(), new NewsColumn(), new NewsColumn()]
		this.recomputeSliders()
	}

	addColumn() {
		if (this.columns.length >= 6) {
			return
		}

		const width = (WIDTH - (GAP * this.columns.length)) / (this.columns.length + 1)

		for (const column of this.columns) {
			column.width = Math.max(MIN_WIDTH, Math.ceil(column.width - (width + GAP) / this.columns.length))
		}

		const column = new NewsColumn()
		column.elements.push(new Header())

		column.width = WIDTH - (this.width() + GAP)

		this.columns.push(column)

		this.fixWidth()

		this.recomputeSliders()
	}

	width() {
		return this.columns.reduce((acc, column) => acc + column.width, 0) + GAP * (this.columns.length - 1)
	}

	removeColumn() {
		if (this.columns.length <= 1) {
			return
		}

		this.columns = this.columns.slice(0, -1)
		this.sliders = this.sliders.slice(0, -1)

		const width = this.width()
		for (const column of this.columns) {
			column.width = Math.ceil(column.width + (WIDTH - width) / this.columns.length)
		}

		this.fixWidth()

		this.recomputeSliders()
	}

	fixWidth() {
		this.columns[0]!.width += WIDTH - this.width()
	}
}

export class NewsColumn {
	width: number = Math.ceil((WIDTH - GAP *2) / 3)
	elements: NewsElement[] = []

	constructor(data?: any) {
		if (data) {
			this.import(data)
		}
	}

	up(element: NewsElement) {
		arrayUp(this.elements, element)
	}

	down(element: NewsElement) {
		arrayDown(this.elements, element)
	}

	remove(element: NewsElement) {
		this.elements = this.elements.filter(e => e !== element)
	}

	addTitle() {
		this.elements.push(new Title())
	}

	addHeader() {
		this.elements.push(new Header())
	}

	addSeparator() {
		this.elements.push(new Separator())
	}

	addArticle() {
		this.elements.push(new Article())
	}

	import(data: any) {
		this.width = Number.isInteger(data.width) ? data.width : 360
		this.elements = Array.isArray(data.elements) ? data.elements.map((data: any) => {
			if (data.title !== undefined) {
				return new Title(data)
			} else if (data.header !== undefined) {
				return new Header(data)
			} else if (data.align !== undefined) {
				return new Separator(data)
			} else if (data.content !== undefined) {
				return new Article(data)
			}

			console.error(data)
			throw new Error('Unknown news element')
		}) : []
	}
}

export class NewsElement {
	hacked = false

	import(data: any) {
		this.hacked = data.hacked === true
	}
}

export class Title extends NewsElement {
	big = 'news'
	title = '11 janvier 2038\nN°2'
	color = '#00ffcc'

	constructor(data?: any) {
		super()

		if (data) {
			this.import(data)
		}
	}

	override import(data: any) {
		super.import(data)

		this.big = isString(data.big) ? data.big : 'news'
		this.title = isString(data.title) ? data.title : ''
		this.color = isString(data.color) ? data.color : '#00ffcc'
	}

	titleHtml(sanitizer: DomSanitizer) {
		let result = this.title.replace(/[\n\r]+/g, '___BR___')

		result = sanitizer.sanitize(SecurityContext.HTML,result) || ''

		result = result.replace(/([\d]+)([^\d\s.,_;!\n\r:?]+)/g, '$1<sup>$2</sup>')

		return result.split('___BR___')
	}
}

export class Header extends NewsElement {
	header = 'FLASH'
	color = '#00ffcc'

	constructor(data?: any) {
		super()

		if (data) {
			this.import(data)
		}
	}

	override import(data: any) {
		super.import(data)

		this.header = isString(data.header) ? data.header : 'FLASH'
		this.color = isString(data.color) ? data.color : '#00ffcc'
	}
}

export class Separator extends NewsElement {
	align = 'left'
	color = '#00ffcc'

	constructor(data?: any) {
		super()

		if (data) {
			this.import(data)
		}
	}

	override import(data: any) {
		super.import(data)

		this.align = isString(data.align) ? data.align : 'left'
		this.color = isString(data.color) ? data.color : '#00ffcc50'
	}
}

export class Article extends NewsElement {
	corners = [false, true, false, true]
	shadowX = true
	shadowY = false
	background = 0
	color = '#00ffcc'
	bgColor = '#00ffcc'
	bug = false
	content = `
Ceci est un texte d'exemple pour vous montrer ce qui est possible de faire.

# Ceci est un titre

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

	constructor(data?: any) {
		super()

		if (data) {
			this.import(data)
		}
	}

	override import(data: any) {
		super.import(data)

		this.corners = Array.isArray(data.corners) ? data.corners.map((c: any) => c === true) : [false, true, false, true]
		this.shadowX = data.shadowX === true
		this.shadowY = data.shadowY === true
		this.background = Number.isInteger(data.background) ? data.background : 0
		this.color = isString(data.color) ? data.color : '#00ffcc'
		this.bgColor = isString(data.bgColor) ? data.bgColor : '#00ffcc'
		this.content = isString(data.content) ? data.content : ''
		this.bug = data.bug === true
	}
}
