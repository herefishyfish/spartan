import { CUSTOM_ELEMENTS_SCHEMA, Component, NO_ERRORS_SCHEMA, inject } from '@angular/core';
import { NativeScriptCommonModule, RouterExtensions } from '@nativescript/angular';
import {
  HlmBlockquoteDirective,
  HlmCodeDirective,
  HlmH1Directive,
  HlmH2Directive,
  HlmH3Directive,
  HlmH4Directive,
  HlmLargeDirective,
  HlmLeadDirective,
  HlmMutedDirective,
  HlmSmallDirective,
  HlmPDirective,
  HlmUlDirective,
} from '@spartan-ng/ui-typography-helm';

@Component({
  selector: 'spartan-button',
  template: `
    <ActionBar title="Spartan Typography" flat="true">
      <NavigationButton text="Back" (tap)="router.back()" android.systemIcon="ic_menu_back"></NavigationButton>
    </ActionBar>

    <StackLayout class="p-10">
      <Label class="my-1" hlmBlockquote>hlmBlockquote</Label>
      <Label class="my-1" hlmCode>hlmCode</Label>
      <Label class="my-1" hlmH1>hlmH1</Label>
      <Label class="my-1" hlmH2>hlmH2</Label>
      <Label class="my-1" hlmH3>hlmH3</Label>
      <Label class="my-1" hlmH4>hlmH4</Label>
      <Label class="my-1" hlmLarge>hlmLarge</Label>
      <Label class="my-1" hlmLead>hlmLead</Label>
      <Label class="my-1" hlmMuted>hlmMuted</Label>
      <Label class="my-1" hlmSmall>hlmSmall</Label>
      <Label class="my-1" hlmP>hlmP</Label>
      <Label class="my-1" hlmUl>hlmUl</Label>
    </StackLayout>
  `,
  standalone: true,
  imports: [
    NativeScriptCommonModule,
    HlmBlockquoteDirective,
    HlmCodeDirective,
    HlmH1Directive,
    HlmH2Directive,
    HlmH3Directive,
    HlmH4Directive,
    HlmLargeDirective,
    HlmLeadDirective,
    HlmMutedDirective,
    HlmSmallDirective,
    HlmPDirective,
    HlmUlDirective,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class SpartanTypographyPage {
  public router = inject(RouterExtensions);
}
