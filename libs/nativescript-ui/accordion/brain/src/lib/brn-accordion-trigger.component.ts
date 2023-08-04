import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  ElementRef,
  NO_ERRORS_SCHEMA,
  forwardRef,
  inject,
  signal,
  HostListener,
} from '@angular/core';
import { registerElement } from '@nativescript/angular';
import { FlexboxLayout, CSSType } from '@nativescript/core';
import { BrnAccordionComponent } from './brn-accordion.component';
import { BrnAccordionItemComponent } from './brn-accordion-item.component';
import { CustomElementClassSettable, SET_CLASS_TO_CUSTOM_ELEMENT_TOKEN } from '@spartan-ng/ui-core-brain';
import { HlmSmallDirective } from '@spartan-ng/ui-typography-helm';

registerElement('brn-accordion-trigger', () => FlexboxLayout);
@CSSType('brn-accordion-trigger')
@Component({
  selector: 'brn-accordion-trigger',
  standalone: true,
  providers: [
    {
      provide: SET_CLASS_TO_CUSTOM_ELEMENT_TOKEN,
      useExisting: forwardRef(() => BrnAccordionTriggerComponent),
    },
  ],
  host: {
    '[attr.data-state]': 'state()',
    '[attr.aria-expanded]': 'state() === "open"',
    '[attr.aria-controls]': 'ariaControls',
    role: 'heading',
    'aria-level': '3',
    '[id]': 'id',
  },
  template: `
    <Label hlmSmall class="m-4">
      <ng-content />
    </Label>
  `,
  imports: [HlmSmallDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class BrnAccordionTriggerComponent extends FlexboxLayout implements CustomElementClassSettable {
  private _accordion = inject(BrnAccordionComponent);
  private _item = inject(BrnAccordionItemComponent);
  private _elementRef = inject(ElementRef);

  public state = this._item.state;
  public id = 'brn-accordion-trigger-' + this._item.id;
  public ariaControls = 'brn-accordion-content-' + this._item.id;

  private _btnClass = signal('');
  public btnClass = this._btnClass.asReadonly();

  constructor() {
    super();
    if (!this._accordion) {
      throw Error('Accordion trigger can only be used inside an Accordion. Add brnAccordion to ancestor.');
    }

    if (!this._item) {
      throw Error('Accordion trigger can only be used inside an AccordionItem. Add brnAccordionItem to parent.');
    }
  }

  public setClassToCustomElement(classes: string) {
    this._btnClass.set(classes);
  }

  @HostListener('tap')
  protected toggleAccordionItem() {
    this._accordion.toggleItem(this._item.id);
  }
}
