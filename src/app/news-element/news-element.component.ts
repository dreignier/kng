import { Component, Input, ViewEncapsulation } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'
import { Converter, ShowdownExtension } from 'showdown'
import { Article, Header, NewsElement, Separator, Title } from '../model/news'

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
  selector: 'app-news-element',
  standalone: true,
  imports: [],
  templateUrl: './news-element.component.html',
  styleUrl: './news-element.component.scss',
	encapsulation: ViewEncapsulation.None
})
export class NewsElementComponent {
	@Input() element!: NewsElement
	converter = new Converter({ extensions: showdownExtensions })

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
