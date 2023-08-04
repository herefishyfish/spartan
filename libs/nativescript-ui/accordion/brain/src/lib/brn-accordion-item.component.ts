import { Component, computed, inject } from '@angular/core';
import { BrnAccordionComponent } from './brn-accordion.component';
import { StackLayout, CSSType } from '@nativescript/core';
import { registerElement } from '@nativescript/angular';

registerElement('brn-accordion-item', () => StackLayout);
let itemIdGenerator = 0;

@CSSType('brn-accordion-item')
@Component({
  selector: 'brn-accordion-item',
  standalone: true,
  host: {
    '[attr.data-state]': 'state()',
  },
  template: ` <ng-content />`,
})
export class BrnAccordionItemComponent extends StackLayout {
  private _accordion = inject(BrnAccordionComponent);

  public id: any = itemIdGenerator++;
  public state = computed(() => (this._accordion.openItemIds().includes(this.id) ? 'open' : 'closed'));

  constructor() {
    super();
    if (!this._accordion) {
      throw Error('Accordion trigger can only be used inside an Accordion. Add brnAccordion to ancestor.');
    }
  }
}
