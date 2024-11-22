import { Component, Input, ViewEncapsulation } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'
import { Article, Header, NewsElement, Separator, Title } from '../model/news'
import { showdownConverter } from '../util'

@Component({
  selector: 'app-news-element',
  standalone: true,
  imports: [],
  templateUrl: './news-element.component.html',
  styleUrl: './news-element.component.scss',
	encapsulation: ViewEncapsulation.None
})
export class NewsElementComponent {
	@Input() element!: NewsElement
	converter = showdownConverter()

	constructor(
		readonly sanitizer: DomSanitizer
	) {}

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
}
