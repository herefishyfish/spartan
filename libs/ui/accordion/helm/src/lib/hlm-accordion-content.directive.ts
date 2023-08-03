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

    if (isPlatformBrowser(this._platformId)) {
      this._changes = new MutationObserver((mutations: MutationRecord[]) => {
        mutations.forEach((mutation: MutationRecord) => {
          if (mutation.attributeName !== 'data-state') return;
          const state = (mutation.target as any).attributes.getNamedItem(mutation.attributeName)?.value;
          this.state.set(state);
        });
      });
    }

    Promise.resolve().then(() => {
      this.initialHeight = this._element.offsetHeight;
      this._changes?.observe(this._element, {
        attributes: true,
        childList: true,
        characterData: true,
      });
    });

    effect(
      () => {
        const isOpen = this.state() === 'open';
        Promise.resolve().then(() => this.height.set(isOpen ? this.initialHeight : 0));
      },
      {
        injector: this._injector,
        allowSignalWrites: true,
      }
    );
  }

  generateClass() {
    return hlm('overflow-hidden text-sm transition-all', this._inputs);
  }
}
