import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  HostListener,
  NO_ERRORS_SCHEMA,
  effect,
  forwardRef,
  inject,
  signal,
} from '@angular/core';
import { BrnAccordionItemComponent } from './brn-accordion-item.component';
import { CustomElementClassSettable, SET_CLASS_TO_CUSTOM_ELEMENT_TOKEN } from '@spartan-ng/ui-core-brain';
import { registerElement } from '@nativescript/angular';
import { LoadEventData, StackLayout, CSSType } from '@nativescript/core';

registerElement('brn-accordion-content', () => StackLayout);

@CSSType('brn-accordion-content')
@Component({
  selector: 'brn-accordion-content',
  standalone: true,
  providers: [
    {
      provide: SET_CLASS_TO_CUSTOM_ELEMENT_TOKEN,
      useExisting: forwardRef(() => BrnAccordionContentComponent),
    },
  ],
  host: {
    '[attr.data-state]': 'state()',
    '[style.--brn-collapsible-content-height]': 'initialHeight',
    '[id]': 'id',
    '[class]': 'contentClass()',
  },
  template: ` <ng-content /> `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class BrnAccordionContentComponent extends StackLayout implements CustomElementClassSettable {
  private _item = inject(BrnAccordionItemComponent);
  private view: StackLayout | undefined;

  public state = this._item.state;
  public id = 'brn-accordion-content-' + this._item.id;
  protected initialHeight = 0.01;

  private _contentClass = signal('');
  public contentClass = this._contentClass.asReadonly();

  constructor() {
    super();
    if (!this._item) {
      throw Error('Accordion trigger can only be used inside an AccordionItem. Add brnAccordionItem to parent.');
    }

    effect(() => {
      const isOpen = this.state() === 'open';
      if (isOpen) {
        this.view?.animate({
          height: this.initialHeight,
          duration: 200,
          opacity: 1,
        });
      } else {
        this.view?.animate({
          height: 1,
          duration: 200,
          opacity: 0,
        });
      }
    });
  }

  @HostListener('loaded', ['$event'])
  public onLoadedAnimation(event: LoadEventData) {
    this.view = event.object as StackLayout;
    this.view.originY = -0.1;
    setTimeout(() => {
      this.initialHeight = this.view.getActualSize().height;

      this.view.animate({
        height: 1,
        duration: 0,
        opacity: 0,
      });
    });
  }

  public setClassToCustomElement(classes: string) {
    this._contentClass.set(classes);
  }
}
