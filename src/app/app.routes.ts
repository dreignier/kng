import { Routes } from '@angular/router'
import { MainComponent } from './main/main.component'
import { AboutPageComponent } from './page/about-page/about-page.component'
import { ConstantsPageComponent } from './page/constants-page/constants-page.component'
import { GeneratorPageComponent } from './page/generator-page/generator-page.component'

export const routes: Routes = [{
	path: '',
	component: MainComponent,
	children: [
		{ path: '', component: GeneratorPageComponent },
		{ path: 'about', component: AboutPageComponent },
		{ path: 'constants', component: ConstantsPageComponent }
	]
}];
