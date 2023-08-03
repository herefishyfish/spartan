import { Directive, HostBinding } from '@angular/core';
import { CoreTypes, TouchAnimationOptions } from '@nativescript/core';
import { HlmButtonDirective as HostHlmButtonDirective } from '@spartan-ng/ui-button-helm';

@Directive({
  selector: '[hlmBtn]',
  standalone: true,
  hostDirectives: [
    {
      directive: HostHlmButtonDirective,
      inputs: ['variant', 'size', 'class'],
    },
  ],
})
export class HlmButtonDirective {
  @HostBinding('touchAnimation')
  private _touchAnimation: TouchAnimationOptions = {
    down: {
      scale: { x: 0.99, y: 0.99 },
      opacity: 0.9,
      duration: 125,
      curve: CoreTypes.AnimationCurve.easeInOut,
    },
    up: {
      scale: { x: 1, y: 1 },
      opacity: 1,
      duration: 125,
      curve: CoreTypes.AnimationCurve.easeInOut,
    },
  };
}
