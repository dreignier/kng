import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { DatabaseService } from '../../database.service'
import { DialogService } from '../../dialog/dialog.service'
import { IconComponent } from '../../icon/icon.component'
import { MessageService } from '../../message/message.service'
import { ModalCanvasComponent } from '../../modal-canvas/modal-canvas.component'
import { ModalComponent } from '../../modal/modal.component'
import News, { Article, Header, NewsElement, Separator, Title } from '../../model/news'
import { NewsElementFormComponent } from '../../news-element-form/news-element-form.component'
import { NewsElementComponent } from '../../news-element/news-element.component'

@Component({
  selector: 'app-news-creator-page',
  standalone: true,
  imports: [FormsModule, ModalCanvasComponent, ModalComponent, IconComponent, NewsElementComponent, NewsElementFormComponent],
  templateUrl: './news-creator-page.component.html',
  styleUrl: './news-creator-page.component.scss'
})
export class NewsCreatorPageComponent implements OnInit, OnDestroy{
	news = new News()
	activeElement?: NewsElement
	editedElement?: NewsElement
	sliders: number[] = []

	imported = ''
	exported = ''
	massImportStrategy: 'rename' | 'ignore' | 'replace' = 'rename'
	massExportNames: Set<string> = new Set()

	@ViewChild('imageModal') imageModal!: ModalCanvasComponent
	@ViewChild('exportModal') exportModal!: ModalComponent
	@ViewChild('importModal') importModal!: ModalComponent
	@ViewChild('editModal') editModal!: ModalComponent
	@ViewChild('massExportModal') massExportModal!: ModalComponent
	@ViewChild('massImportModal') massImportModal!: ModalComponent

	constructor(
		readonly db: DatabaseService,
		private dialog: DialogService,
		private message: MessageService
	) {
		this.news.columns[0].elements.push(new Title(), new Article())
		this.news.columns[1].elements.push(new Separator(), new Article(), new Separator(), new Separator({ align: 'right' }))
		this.news.columns[2].elements.push(new Header(), new Article())
	}

	ngOnInit(): void {
		document.body.classList.add('bg-news')
	}

	ngOnDestroy(): void {
		document.body.classList.remove('bg-news')
	}

	save(news: News) {
		if (!news.name?.trim()) {
			return
		}

		this.db.saveNews(news)
		this.message.success('Journal RA sauvegardé')
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

	onClick(element: NewsElement, event: MouseEvent) {
		event.stopPropagation()

		this.activeElement = element
	}

	onGlobalClick() {
		this.activeElement = undefined
	}

	edit(element: NewsElement) {
		this.editedElement = new (element.constructor as any)()
		this.editedElement?.import(this.activeElement)
		this.editModal.open()
	}

	saveEditedElement() {
		this.activeElement!.import(this.editedElement)
		this.editModal.close()
	}

	editNews(news: News) {
		this.news = new News()
		this.news.import(news)
		window.scrollTo(0, 0)
	}

	deleteNews(news: News) {
		this.dialog.confirm(`Voulez vous vraiment supprimer le jounral RA ${news.name} ?`).subscribe(() => {
			this.db.deleteNews(news)
			this.message.success('Jounral RA supprimé')
		})
	}

	openMassExport() {
		this.massExportNames.clear()
		this.massExportModal.open()
	}

	massExportSelectAll() {
		for (const news of this.db.news) {
			this.massExportNames.add(news.name)
		}
	}

	massExport() {
		this.exported = this.db.exportNews(this.massExportNames)
	}

	openMassImport() {
		this.imported = ''
		this.massImportModal.open()
	}

	massImport() {
		let news = JSON.parse(this.imported)

		if (news) {
			if (!Array.isArray(news)) {
        news = [news];
      }

			news = news.map((e: any) => new News(e));

			this.db.importNews(news, this.massImportStrategy)

			this.massImportModal.close()
		}
	}
}
