import { NgFor } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, NO_ERRORS_SCHEMA, inject } from '@angular/core';
import { NativeScriptCommonModule, RouterExtensions } from '@nativescript/angular';
import { HlmButtonDirective } from '@spartan-ng/nativescript-ui-button-helm';
import { routes } from './app.routing';

@Component({
  selector: 'spartan-home',
  template: `
    <ActionBar title="Spartan App" class="action-bar" flat="true"> </ActionBar>
    <StackLayout class="p-10">
      <Label text="Spartan" class="h1 text-center c-white"></Label>

      <Button *ngFor="let route of routes" (tap)="navigate(route)" class="my-1" hlmBtn>
        {{ route | titlecase }}
      </Button>
    </StackLayout>
  `,
  standalone: true,
  imports: [NativeScriptCommonModule, NgFor, HlmButtonDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class SpartanHomePage {
  private _routerExtensions = inject(RouterExtensions);
  routes = routes.filter((route) => route.path !== 'home' && route.path !== '').map((route) => route.path);

  navigate(link) {
    this._routerExtensions.navigateByUrl(link);
  }
}
