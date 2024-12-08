import { Component, Input, OnInit } from '@angular/core'
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
export class CodexContentComponent implements OnInit {
	@Input() width!: number
	@Input() dark = false
	parts: Part[] = []
	sections: Section[] = []
	scaleCache: Record<string, { scale: number; mb: number }> = {}
	_content = ''
	initialized = false

	converter = showdownConverter({
		type: 'lang',
		regex: /\[\[\[([^\]]+)\]\]\]/g,
		replace: (match: string, text: string) => {
			let result = ''
			let first = true
			let style = ''

			if (text.startsWith('=')) {
				style = 'codex-fixed'
				text = text.slice(1)
			} else if (text.startsWith('>')) {
				style = 'table-right'
				text = text.slice(1)
			} else if (text.startsWith('<')) {
				style = 'table-center'
				text = text.slice(1)
			}

			const rows = text.split('---').map(row => row.split('||'))
			const columns = rows.reduce((max, row) => Math.max(max, row.length), 0)

			for (const row of rows) {
				result += '<tr>'

				for (let cell of row) {
					result += '<td'

					if (first && row.length === 1) {
						result += ` colspan="${columns}" class="table-header"`
					} else {
						const match = cell.match(/^\n*([\:0-9]+)/)

						if (match?.[1]) {
							if (match[1].includes(':')) {
								result += ' class="cell-panel"'
							}

							const colspan = Number(match[1].replace(':', ''))
							if (colspan > 1) {
								result += ` colspan="${colspan}"`
							}

							cell = cell.slice(match[0].length)
						}
					}

					result += '>' + this.converter.makeHtml(cell) + '</td>'
				}

				result += '</tr>'

				first = false
			}

			return `<table class="${style}" >` + result + '</table>'
		}
	}, {
		type: 'lang',
		regex: /([a-zéàèîïëù.?!"' «»*=_\-])\n([a-zéàèîïëù"' «»*=_\-])/gi,
		replace: '$1<span class="mr-2"><br>&nbsp;</span>$2'
	}, {
		type: 'output',
		regex: /{{{{[ \n]*([^}]+)[ \n]*}}}}/gi,
		replace: '<div class="panel panel-alt">$1</div>'
	}, {
		type: 'output',
		regex: /{{{[ \n]*([^}]+)[ \n]*}}}/g,
		replace: '<div class="panel">$1</div>'
	}, {
		type: 'lang',
		regex: />>>([^<>\n]+)>>>/g,
		replace: '<span class="codex-margin-right">$1</span>'
	}, {
		type: 'lang',
		regex: /<<<([^<>\n]+)<<</g,
		replace: '<span class="codex-margin-left">$1</span>'
	}, {
		type: 'output',
		regex: /\(\(\(\([ \n]*([^)]+)[ \n]*\)\)\)\)/g,
		replace: '<div class="badge badge-big"><span>$1</span></div>'
	}, {
		type: 'output',
		regex: /\(\(\([ \n]*([^)]+)[ \n]*\)\)\)/g,
		replace: '<div class="badge"><span>$1</span></div>'
	})

	ngOnInit(): void {
		this.initialized = true

		if (this._content) {
			this.content = this._content
		}
	}

	@Input() set content(content: string) {
		if (!this.initialized) {
			this._content = content
			return
		}

		this.sections = []
		this.parts = []

		if (!content?.trim()) {
			return
		}

		for (let sectionText of content.split(/____/g)) {
			const section = new Section('codex-section-' + this.sections.length, this.width)

			if (sectionText.startsWith('vvv') || sectionText.startsWith('VVV')) {
				section.bottom = true
				sectionText = sectionText.slice(3)
			}

			for (let columnText of sectionText.split(/\|\|\|\|/g)) {
				const column = new Column(section.columns.length, section)

				let index = 0
				for (const match of Array.from(columnText.matchAll(/\[([a-z]{3}):([^\]]+)\]/gmi))) {
					column.parts.push(new Part(column.parts.length, column, columnText.slice(index, match.index).trim()))
					column.parts.push(new Part(column.parts.length, column, match[2].trim(), match[1].toLowerCase()))
					index = match.index + match[0].length
				}

				column.parts.push(new Part(column.parts.length, column, columnText.slice(index).trim()))
				section.columns.push(column)
				this.parts.push(...column.parts)
			}

			this.sections.push(section)
		}

		for (const part of this.parts) {
			if (part.component) {
				const cache = this.scaleCache[part.cacheId(part.column.width)]
				if (cache) {
					part.scale = cache.scale
					part.mb = cache.mb
				}
			}
		}

		this.layout()
	}

	layout() {
		setTimeout(() => {
			for (const part of this.parts) {
				if (part.component && part.scale === 1) {
					const element = document.getElementById(part.id)

					if (!element) {
						continue
					}

					const width = part.component === 'pnj' ? 793 : 362

					if (width < part.column.width) {
						part.scale = 1
						part.mb = 16
						this.scaleCache[part.cacheId(part.column.width)] = { scale: part.scale, mb: part.mb }
						continue
					}

					part.scale = Math.round(((part.column.width / width) + Number.EPSILON) * 100) / 100
					const height = element.offsetHeight
					part.mb = (-height * (1 - part.scale)) + 16

					this.scaleCache[part.cacheId(part.column.width)] = { scale: part.scale, mb: part.mb }
				}
			}
		}, 10)
	}
}

class Section  {
	columns: Column[] = []
	bottom = false

	constructor(
		public id: string,
		public width: number
	) {}
}

class Column {
	parts: Part[] = []
	constructor(
		public _id: number,
		public section: Section
	) {}

	get id() {
		return this.section.id + '-' + this._id
	}

	get width() {
		return this.section.width / this.section.columns.length
	}
}

class Part {
	scale = 1
	mb = 16

	constructor(
		public _id: number,
		public column: Column,
		public text: string,
		public component?: string
	) {}

	get id() {
		return this.column.id + '-' + this._id + '-' + (this.component || 'TXT') + '-' + this.text
	}

	cacheId(width: number) {
		return this.component + '-' + this.text + '-' + width
	}
}
