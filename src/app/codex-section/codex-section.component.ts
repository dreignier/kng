import { Component, Input } from '@angular/core'
import { EquipmentComponent } from '../equipment/equipment.component'
import { NpcComponent } from '../npc/npc.component'
import { showdownConverter } from '../util'
import { VehicleComponent } from '../vehicle/vehicle.component'

@Component({
  selector: 'app-codex-section',
  standalone: true,
  imports: [NpcComponent, EquipmentComponent, VehicleComponent],
  templateUrl: './codex-section.component.html',
  styleUrl: './codex-section.component.scss'
})
export class CodexSectionComponent {
	@Input() section!: Section

	converter = showdownConverter({
		type: 'lang',
		regex: /\[\[\[([^\]]+)\]\]\]/g,
		replace: (match: string, text: string) => {
			let result = ''
			let style = ''
			let caption = ''

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

			if (rows[0]?.length === 1) {
				caption += '<caption class="table-header">' + this.converter.makeHtml(rows[0][0]) + '</caption>'
			}

			rows.shift()

			for (const row of rows) {
				result += '<tr>'

				for (let cell of row) {
					cell = cell.trim()

					result += '<td'

					const match = cell.match(/^([0-9]+)\|/)
					if (match) {
						result += ` colspan="${match[1]}"`
						cell = cell.slice(match[0].length)
					}

					if (cell.startsWith(':')) {
						result += ' class="cell-panel"'
						cell = cell.slice(1)
					}

					result += '>' + this.converter.makeHtml(cell) + '</td>'
				}

				result += '</tr>'
			}

			return `<table class="${style}" >` + caption + result + '</table>'
		}
	}, {
		type: 'lang',
		regex: /([a-z0-9éàèîïëù.?!"' «»])\n([a-zéàèîïëù"' «»])/gi,
		replace: '$1<span class="mr-2"><br>&nbsp;</span>$2'
	}, {
		type: 'lang',
		regex: /([a-z0-9éàèîïëù.?!"' «»\)])\n([=])/gi,
		replace: '$1<br>$2'
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

}

export class Section  {
	columns: Column[] = []

	constructor(
		public id: string,
		public width: number
	) {}
}

export class Column {
	parts: Part[] = []
	constructor(
		public _id: number,
		public section: Section
	) {}

	get id() {
		return this.section.id + '-' + this._id
	}

	get width() {
		return (this.section.width - (this.section.columns.length - 1) * 20) / this.section.columns.length
	}
}

export class Part {
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
