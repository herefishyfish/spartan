import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  ElementRef,
  NO_ERRORS_SCHEMA,
  effect,
  forwardRef,
  inject,
  signal,
} from '@angular/core';
import { BrnAccordionItemComponent } from './brn-accordion-item.component';
import { CustomElementClassSettable, SET_CLASS_TO_CUSTOM_ELEMENT_TOKEN } from '@spartan-ng/ui-core-brain';
import { LoadEventData, StackLayout } from '@nativescript/core';

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
  },
  template: `
    <StackLayout (loaded)="onLoaded($event)" [class]="contentClass()">
      <ng-content />
    </StackLayout>
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class BrnAccordionContentComponent implements CustomElementClassSettable {
  private _item = inject(BrnAccordionItemComponent);
  private view: StackLayout | undefined;

  public state = this._item.state;
  public id = 'brn-accordion-content-' + this._item.id;
  protected initialHeight = 0.01;

  private _contentClass = signal('');
  public contentClass = this._contentClass.asReadonly();

  constructor() {
    if (!this._item) {
      throw Error('Accordion trigger can only be used inside an AccordionItem. Add brnAccordionItem to parent.');
    }

    effect(() => {
      const isOpen = this.state() === 'open';
      if (isOpen) {
        this.view?.animate({
          height: this.initialHeight,
          duration: 330,
          opacity: 1,
        });
      } else {
        this.view?.animate({
          height: 1,
          duration: 330,
          opacity: 0,
        });
      }
    });
  }

  public onLoaded(event: LoadEventData) {
    this.view = event.object as StackLayout;
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
