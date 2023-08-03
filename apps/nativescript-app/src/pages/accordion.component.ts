import { CUSTOM_ELEMENTS_SCHEMA, Component, NO_ERRORS_SCHEMA, inject } from '@angular/core';
import { NativeScriptCommonModule, RouterExtensions } from '@nativescript/angular';
import {
  BrnAccordionComponent,
  BrnAccordionContentComponent,
  BrnAccordionItemComponent,
  BrnAccordionTriggerComponent,
} from '@spartan-ng/nativescript-ui-accordion-brain';
import {
  HlmAccordionDirective,
  HlmAccordionItemDirective,
  HlmAccordionTriggerDirective,
  HlmAccordionContentDirective,
  // HlmAccordionIconComponent,
} from '@spartan-ng/ui-accordion-helm';
import { HlmPDirective } from '@spartan-ng/ui-typography-helm';

@Component({
  selector: 'spartan-button',
  standalone: true,
  imports: [
    NativeScriptCommonModule,
    BrnAccordionComponent,
    BrnAccordionContentComponent,
    BrnAccordionItemComponent,
    BrnAccordionTriggerComponent,
    HlmAccordionDirective,
    HlmAccordionItemDirective,
    HlmAccordionTriggerDirective,
    HlmAccordionContentDirective,
    HlmPDirective,
    // HlmAccordionIconComponent,
  ],
  template: `
    <ActionBar title="Spartan Accordion" flat="true">
      <NavigationButton text="Back" (tap)="router.back()" android.systemIcon="ic_menu_back"></NavigationButton>
    </ActionBar>

    <StackLayout>
      <brn-accordion hlm>
        <brn-accordion-item hlm>
          <brn-accordion-trigger hlm>
            <span>Is it accessible?</span>
            <!-- <hlm-accordion-icon /> -->
          </brn-accordion-trigger>
          <brn-accordion-content hlm>
            <Label>Yes. It adheres to the WAI-ARIA design pattern.</Label>
          </brn-accordion-content>
        </brn-accordion-item>

        <brn-accordion-item hlm>
          <brn-accordion-trigger hlm>
            <span>Is it styled</span>
            <!-- <hlm-accordion-icon /> -->
          </brn-accordion-trigger>
          <brn-accordion-content hlm>
            <Label textWrap="true" hlmP
              >Yes. It comes with default styles that matches the other components' aesthetic.</Label
            >
          </brn-accordion-content>
        </brn-accordion-item>

        <brn-accordion-item hlm>
          <brn-accordion-trigger hlm>
            <span>Is it animated?</span>
            <!-- <hlm-accordion-icon /> -->
          </brn-accordion-trigger>
          <brn-accordion-content hlm>
            <Label>Yes. It's animated by default, but you can disable it if you prefer.</Label>
          </brn-accordion-content>
        </brn-accordion-item>
      </brn-accordion>
    </StackLayout>
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class SpartanAccordionPage {
  public router = inject(RouterExtensions);
}
