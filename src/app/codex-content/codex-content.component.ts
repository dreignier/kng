import { Component, Input, OnInit } from '@angular/core'
import { CodexSectionComponent, Column, Part, Section } from '../codex-section/codex-section.component'

@Component({
  selector: 'app-codex-content',
  standalone: true,
  imports: [CodexSectionComponent],
  templateUrl: './codex-content.component.html',
  styleUrl: './codex-content.component.scss'
})
export class CodexContentComponent implements OnInit {
	@Input() width!: number
	@Input() dark = false
	parts: Part[] = []
	sections: Section[] = []
	bottomSections: Section[] = []
	scaleCache: Record<string, { scale: number; mb: number }> = {}
	_content = ''
	initialized = false

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
		let bottom = false

		if (!content?.trim()) {
			return
		}

		for (let sectionText of content.split(/____/g)) {
			const section = new Section('codex-section-' + this.sections.length, this.width)

			if (sectionText.startsWith('vvv') || sectionText.startsWith('VVV')) {
				sectionText = sectionText.slice(3)
				bottom = true
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

			if (bottom) {
				this.bottomSections.push(section)
			} else {
				this.sections.push(section)
			}
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
