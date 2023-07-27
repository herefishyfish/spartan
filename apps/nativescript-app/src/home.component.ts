import { NgFor } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, NO_ERRORS_SCHEMA, inject } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { HlmButtonDirective } from '@spartan-ng/nativescript-ui-button-helm';

@Component({
  selector: 'spartan-home',
  template: `
    <ActionBar title="My App" class="action-bar" flat="true"> </ActionBar>
    <StackLayout class="p-20">
      <Label text="Enjoy" class="h1 text-center c-white"></Label>

      <Button *ngFor="let route of routes" (tap)="navigate(route.link)" class="my-1" hlmBtn>
        {{ route.title }}
      </Button>
    </StackLayout>
  `,
  standalone: true,
  imports: [NgFor, HlmButtonDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class SpartanHomeComponent {
  private _routerExtensions = inject(RouterExtensions);
  routes = [
    { link: 'buttons', title: 'Buttons' },
    { link: 'card', title: 'Card' },
  ];

  navigate(link) {
    console.log('navigate', link);
    this._routerExtensions.navigateByUrl(link);
  }
}
