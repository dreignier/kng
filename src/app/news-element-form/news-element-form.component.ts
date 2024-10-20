import { Component, Input } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { ColorPickerModule } from 'ngx-color-picker'
import { IconComponent } from '../icon/icon.component'
import { Article, Header, NewsElement, Separator, Title } from '../model/news'

@Component({
  selector: 'app-news-element-form',
  standalone: true,
  imports: [FormsModule, IconComponent, ColorPickerModule],
  templateUrl: './news-element-form.component.html',
  styleUrl: './news-element-form.component.scss'
})
export class NewsElementFormComponent {
	@Input() element!: NewsElement

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
