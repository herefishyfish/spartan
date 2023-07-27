import { Directive, HostListener } from '@angular/core';
import { LoadEventData, TextField } from '@nativescript/core';
import { HlmInputDirective as HostHlmInputDirective } from '@spartan-ng/ui-input-helm';

@Directive({
  selector: '[hlmInput]',
  standalone: true,
})
export class HlmInputDirective extends HostHlmInputDirective {
  @HostListener('loaded', ['$event'])
  onLoaded(event: LoadEventData) {
    const input = event.object as TextField;

    // TODO: fix styles
  }
}
