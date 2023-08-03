import {
  computed,
  Directive,
  effect,
  ElementRef,
  HostBinding,
  inject,
  Injector,
  Input,
  OnInit,
  PLATFORM_ID,
  Signal,
  signal,
  ViewChild,
} from '@angular/core';
import { ClassValue } from 'clsx';
import { hlm } from '@spartan-ng/ui-core-helm';
import { isPlatformBrowser } from '@angular/common';
import { SET_CLASS_TO_CUSTOM_ELEMENT_TOKEN } from '@spartan-ng/ui-core-brain';
import { BrnAccordionContentComponent } from '@spartan-ng/nativescript-ui-accordion-brain';
import { Color, Label, View } from '@nativescript/core';

@Directive({
  selector: '[hlmAccordionContent],brn-accordion-content[hlm]',
  standalone: true,
  host: {
    '[style.height]': 'cssHeight()',
  },
})
export class HlmAccordionContentDirective implements OnInit {
  private _host = inject(SET_CLASS_TO_CUSTOM_ELEMENT_TOKEN, { optional: true });
  private _brain = inject(BrnAccordionContentComponent);
  private _element = inject(ElementRef);
  private _injector = inject(Injector);
  public _platformId = inject(PLATFORM_ID);

  @HostBinding('class')
  private _class = this.generateClass();
  private _inputs: ClassValue = '';
  private _changes?: MutationObserver;

  protected initialHeight = 0;
  public height = signal(-1);
  public cssHeight = computed(() => (this.height() === -1 ? 'auto' : this.height()));
  public state!: Signal<string>; // = signal('closed');

  @Input()
  set class(inputs: ClassValue) {
    this._inputs = inputs;
    this._class = this.generateClass();
  }

  constructor() {
    this.state = this._brain.state;
  }

  public ngOnInit() {
    this._host?.setClassToCustomElement('pt-1 pb-4');
  }

  generateClass() {
    return hlm('overflow-hidden text-sm transition-all', this._inputs);
  }
}
