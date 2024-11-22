import { Routes } from '@angular/router'
import { MainComponent } from './main/main.component'
import { AboutPageComponent } from './page/about-page/about-page.component'
import { CodexGeneratorPageComponent } from './page/codex-generator-page/codex-generator-page.component'
import { ConstantsPageComponent } from './page/constants-page/constants-page.component'
import { EquipmentGeneratorPageComponent } from './page/equipment-generator-page/equipment-generator-page.component'
import { NewsCreatorPageComponent } from './page/news-creator-page/news-creator-page.component'
import { NpcGeneratorPageComponent } from './page/npc-generator-page/npc-generator-page.component'
import { VehicleGeneratorPageComponent } from './page/vehicle-generator-page/vehicle-generator-page.component'

export const routes: Routes = [{
	path: '',
	component: MainComponent,
	children: [
		{ path: '', redirectTo: 'npc', pathMatch: 'full' },
		{ path: 'npc', component: NpcGeneratorPageComponent },
		{ path: 'equipment', component: EquipmentGeneratorPageComponent },
		{ path: 'vehicle', component: VehicleGeneratorPageComponent},
		{ path: 'news', component: NewsCreatorPageComponent },
		{ path: 'about', component: AboutPageComponent },
		{ path: 'constants', component: ConstantsPageComponent },
		{ path: 'codex', component: CodexGeneratorPageComponent }
	]
}];
