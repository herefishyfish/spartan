// angular
import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';

// nativescript
import { NativeScriptRouterModule } from '@nativescript/angular';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./home.component').then((m) => m.SpartanHomePage),
  },
  {
    path: 'buttons',
    loadComponent: () => import('./pages/buttons.component').then((m) => m.SpartanButtonPage),
  },
  {
    path: 'card',
    loadComponent: () => import('./pages/card.component').then((m) => m.SpartanCardPage),
  },
  {
    path: 'typography',
    loadComponent: () => import('./pages/typography.component').then((m) => m.SpartanTypographyPage),
  },
];

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule],
})
export class AppRoutingModule {}
