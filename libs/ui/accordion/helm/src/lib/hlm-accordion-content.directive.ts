import { Directive, HostBinding, inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { ClassValue } from 'clsx';
import { hlm } from '@spartan-ng/ui-core-helm';
import { SET_CLASS_TO_CUSTOM_ELEMENT_TOKEN } from '@spartan-ng/ui-core-brain';

@Directive({
  selector: '[hlmAccordionContent],brn-accordion-content[hlm]',
  standalone: true,
  host: {
    '[style.height]': 'cssHeight()',
  },
})
export class HlmAccordionContentDirective implements OnInit {
  private _host = inject(SET_CLASS_TO_CUSTOM_ELEMENT_TOKEN, { optional: true });
  public _platformId = inject(PLATFORM_ID);

  @HostBinding('class')
  private _class = this.generateClass();
  private _inputs: ClassValue = '';
  private _changes?: MutationObserver;

  @Input()
  set class(inputs: ClassValue) {
    this._inputs = inputs;
    this._class = this.generateClass();
  }

  public ngOnInit() {
    this._host?.setClassToCustomElement('pt-1 pb-4');
  }

  generateClass() {
    return hlm('overflow-hidden text-sm transition-all', this._inputs);
  }
}
