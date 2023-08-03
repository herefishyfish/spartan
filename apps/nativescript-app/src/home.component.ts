import { NgFor } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, NO_ERRORS_SCHEMA, inject } from '@angular/core';
import { NativeScriptCommonModule, RouterExtensions } from '@nativescript/angular';
import { HlmButtonDirective } from '@spartan-ng/nativescript-ui-button-helm';

@Component({
  selector: 'spartan-home',
  template: `
    <ActionBar title="Spartan App" class="action-bar" flat="true"> </ActionBar>
    <StackLayout class="p-10">
      <Label text="Spartan" class="h1 text-center c-white"></Label>

      <Button *ngFor="let route of routes" (tap)="navigate(route.link)" class="my-1" hlmBtn>
        {{ route.title }}
      </Button>
    </StackLayout>
  `,
  standalone: true,
  imports: [NativeScriptCommonModule, NgFor, HlmButtonDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class SpartanHomePage {
  private _routerExtensions = inject(RouterExtensions);
  routes = [
    { link: 'buttons', title: 'Buttons' },
    { link: 'card', title: 'Card' },
    { link: 'typography', title: 'Typograpy' },
  ];

  navigate(link) {
    this._routerExtensions.navigateByUrl(link);
  }
}
