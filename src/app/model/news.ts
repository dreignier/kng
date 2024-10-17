import { SecurityContext } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'
import { isString } from 'lodash'
import Entity from './entity'

const WIDTH = 1080
const GAP = 20

export default class News extends Entity {
	columns: NewsColumn[] = [new NewsColumn(), new NewsColumn(), new NewsColumn()]

	constructor(data?: any) {
		super()

		if (data) {
			this.import(data)
		}
	}

	import(data: any) {
		this.name = isString(data.name) ? data.name : ''
		this.columns = Array.isArray(data.columns) ? data.columns.map((data: any) => new NewsColumn(data)) : [new NewsColumn(), new NewsColumn(), new NewsColumn()]
	}

	addColumn() {
		const width = (WIDTH - GAP * this.columns.length) / (this.columns.length + 1)

		// Remove the width from all columns
		for (const column of this.columns) {
			column.width -= Math.round(Math.max(100, width / this.columns.length))
		}

		const totalWidth = this.columns.reduce((acc, column) => acc + column.width, 0) + GAP * (this.columns.length + 1)

		const column = new NewsColumn()
		column.width = WIDTH - totalWidth

		this.columns.push(column)
	}

	removeColumn() {
		this.columns = this.columns.slice(0, -1)
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
	color = '#00ffcc44'

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
	}

	titleHtml(sanitizer: DomSanitizer) {
		let result = this.title.replace(/[\n\r]+/g, '___BR___')

		result = sanitizer.sanitize(SecurityContext.HTML,result) || ''

		result = result.replace(/([0-9]+)([^ .,!\n\r:?]+)/g, '$1<sup>$2</sup>')

		return result.split('___BR___')
	}
}

export class Header extends NewsElement {
	header = 'FLASH'
	color = '#00ffcc44'

	constructor(data?: any) {
		super()

		if (data) {
			this.import(data)
		}
	}

	override import(data: any) {
		super.import(data)

		this.header = isString(data.header) ? data.header : 'FLASH'
		this.color = isString(data.color) ? data.color : '#00ffcc44'
	}
}

export class Separator extends NewsElement {
	align = 'left'
	color = '#00ffcc44'

	constructor(data?: any) {
		super()

		if (data) {
			this.import(data)
		}
	}

	override import(data: any) {
		super.import(data)

		this.align = isString(data.align) ? data.align : 'left'
		this.color = isString(data.color) ? data.color : '#00ffcc44'
	}
}

export class Article extends NewsElement {
	corners = [false, true, false, true]
	shadowX = true
	shadowY = false
	background = 0
	color = '#00ffcc'
	bgColor = '#00ffcc44'
	content = `
Ceci est un texte d'exemple pour vous montrer ce qui est possible de faire.

# Ceci est un titre

>>Ce texte est centré<<

*Ce texte est en italique*

**Ce texte est en gras**

__Ce texte est souligné__

==Ce texte est en gros==

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
2. Des personnages vous aiderons
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
		this.bgColor = isString(data.bgColor) ? data.bgColor : '#00ffcc44'
		this.content = isString(data.content) ? data.content : ''
	}
}
