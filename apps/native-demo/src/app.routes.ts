import type { Routes } from '@angular/router';
import { ComponentsPage } from './pages/components.page';
import { DemoPage } from './pages/demo.page';

export const routes: Routes = [
	{ path: '', component: ComponentsPage },
	{ path: 'demo/:slug', component: DemoPage },
];
