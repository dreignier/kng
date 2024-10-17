import { SecurityContext } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'
import { isString } from 'lodash'
import Entity from './entity'

export default class News extends Entity {
	columns: NewsColumn[] = [new NewsColumn(), new NewsColumn(), new NewsColumn()]

	constructor(data?: any) {
		super()

		if (data) {
			this.import(data)
		}

		this.import({
			columns: [{
				elements: [
					{ title: `1er Avril 2038
N°13` },
					{ align: 'left' },
					{ align: 'right' },
					{ shadowX: true, shadowY: true, content: `Le 1^^er^^ Chevalier Schwarzy nous a fait le plaisir de tester notre nouveau lance grenade lourd à propulsion magnétique.

>>« *Cet engin est le meilleur que j'ai jamais vu pour casser du manifestant !* »<<

**Faites comme Schwarzy et équipez votre milice avec ce qu'il se fait de mieux !**

==Gros texte==

==Encore plus gros texte==

===Le plus gros texte possible===

@@Cliquez ici pour en savoir plus@@`}
				]
			}, {
				elements: [
					{ header: 'FLASH' },
					{ align: 'left' },
					{ align: 'right' },
					{ shadowY: true, content: `
# test h1

## test h2

### test h3

\`\`\`
Coucou, ceci est un bloc de code
Coucou, ceci est un bloc de code
Coucou, ceci est un bloc de code
Coucou, ceci est un bloc de code
\`\`\`
`}
				]
			}, {
				elements: [
					{ header: 'FLASH' },
					{ align: 'left' },
					{ align: 'right' },
					{ bgColor: '#ff000044', color: '#ff0000', content: `# ALERTE

Surtout ne \`paniquez\` pas et appliquez les consignes de sécurité suivantes :
1. Restez chez vous
2. Appelez le __Knight__
3. Prenez 5 minutes pour sangloter parce que c'est les PJ qui viennent vous sauver

Si le Knight ne vient pas assez rapidement :
* Surtout ne négociez pas avec le Masque
* Ne léchez pas les créatures de la Chair
* Non les créatures de la Bête ne sont pas des pokemons
* Ne faites pas confiance à votre grille pain
`}
				]
			}]
		})
	}

	import(data: any) {
		this.name = isString(data.name) ? data.name : ''
		this.columns = Array.isArray(data.columns) ? data.columns.map((data: any) => new NewsColumn(data)) : [new NewsColumn(), new NewsColumn(), new NewsColumn()]
	}
}

export class NewsColumn {
	width: number = 360
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
	title = ''
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
	content = ''

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
