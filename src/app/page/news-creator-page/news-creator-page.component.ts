import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { DomSanitizer } from '@angular/platform-browser'
import { Converter, ShowdownExtension } from 'showdown'
import { IconComponent } from '../../icon/icon.component'
import { ModalCanvasComponent } from '../../modal-canvas/modal-canvas.component'
import { ModalComponent } from '../../modal/modal.component'
import News, { Article, Header, NewsElement, Separator, Title } from '../../model/news'

const showdownExtensions: ShowdownExtension[] = [{
	type: 'lang',
	regex: />>([^<]+)<</g,
	replace: '<center>$1</center>'
}, {
	type: 'lang',
	regex: /@@([^@]+)@@/g,
	replace: '<span class="link">$1</span>'
}, {
	type: 'lang',
	regex: /\^\^([^\^]+)\^\^/g,
	replace: '<sup>$1</sup>'
}, {
	type: 'lang',
	regex: /__([^_]+)__/g,
	replace: '<ins>$1</ins>'
}, {
	type: 'lang',
	regex: /====([^=]+)====/g,
	replace: '<big class="biggest">$1</big>'
}, {
	type: 'lang',
	regex: /===([^=]+)===/g,
	replace: '<big class="bigger">$1</big>'
}, {
	type: 'lang',
	regex: /==([^=]+)==/g,
	replace: '<big>$1</big>'
}]

@Component({
  selector: 'app-news-creator-page',
  standalone: true,
  imports: [FormsModule, ModalCanvasComponent, ModalComponent, IconComponent],
  templateUrl: './news-creator-page.component.html',
  styleUrl: './news-creator-page.component.scss',
	encapsulation: ViewEncapsulation.None,
})
export class NewsCreatorPageComponent implements OnInit, OnDestroy{
	news = new News()
	converter = new Converter({ extensions: showdownExtensions })

	imported = ''
	exported = ''

	@ViewChild('imageModal') imageModal!: ModalCanvasComponent
	@ViewChild('exportModal') exportModal!: ModalComponent
	@ViewChild('importModal') importModal!: ModalComponent

	constructor(
		readonly sanitizer: DomSanitizer
	) {}

	ngOnInit(): void {
		document.body.classList.add('bg-news')
	}

	ngOnDestroy(): void {
		document.body.classList.remove('bg-news')
	}

	isArticle(element: NewsElement) {
		return element instanceof Article
	}

	isTitle(element: NewsElement) {
		return element instanceof Title
	}

	isSeparator(element: NewsElement) {
		return element instanceof Separator
	}

	isHeader(element: NewsElement) {
		return element instanceof Header
	}

	save(news: News) {
		if (!news.name?.trim()) {
			return
		}

		// this.db.saveEquipment(equipment)
		// this.message.success('Équipment sauvegardé')
	}

	async image(target: string) {
		const container = document.getElementById('newsContent')!
		container.style.zIndex = "-1"
		container.style.backgroundColor = "#39373e"

		await this.imageModal.open(target)

		container.style.zIndex = "0"
		container.style.backgroundColor = "transparent"
	}

	openImport() {
		this.imported = ''
		this.importModal.open()
	}

	import() {
		this.news = new News()
		this.news.import(JSON.parse(this.imported))
		window.scrollTo(0, 0)
		this.importModal.close()
	}

	export(news: News) {
		this.exported = JSON.stringify(news)
		this.exportModal.open()
	}
}
