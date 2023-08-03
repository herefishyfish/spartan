import { CUSTOM_ELEMENTS_SCHEMA, Component, NO_ERRORS_SCHEMA, inject } from '@angular/core';
import { NativeScriptCommonModule, RouterExtensions } from '@nativescript/angular';
import { HlmButtonDirective } from '@spartan-ng/nativescript-ui-button-helm';

@Component({
  selector: 'spartan-button',
  template: `
    <ActionBar title="Spartan Buttons" flat="true">
      <NavigationButton text="Back" (tap)="router.back()" android.systemIcon="ic_menu_back"></NavigationButton>
    </ActionBar>

    <StackLayout class="p-10">
      <Button class="my-1" hlmBtn>Primary</Button>
      <Button class="my-1" variant="destructive" hlmBtn>Destructive</Button>
      <Button class="my-1" variant="outline" hlmBtn>Outline</Button>
      <Button class="my-1" variant="secondary" hlmBtn>Secondary</Button>
      <Button class="my-1" variant="ghost" hlmBtn>Ghost</Button>
      <Button class="my-1" variant="link" hlmBtn>Link</Button>
    </StackLayout>
  `,
  standalone: true,
  imports: [NativeScriptCommonModule, HlmButtonDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class SpartanButtonPage {
  public router = inject(RouterExtensions);
}
