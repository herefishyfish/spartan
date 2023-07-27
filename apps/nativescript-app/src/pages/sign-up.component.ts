import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { HlmButtonDirective } from '@spartan-ng/nativescript-ui-button-helm';

@Component({
  selector: 'spartan-sign-up',
  template: `
    <GridLayout rows="auto * auto" class="bg-white p-10">
      <Label class="h1">Create an account!</Label>
      <StackLayout row="2">
        <Button class="my-1" variant="outline" hlmBtn>Sign Up</Button>
        <Button class="my-1" variant="ghost" hlmBtn>Cancel</Button>
      </StackLayout>
    </GridLayout>
  `,
  standalone: true,
  imports: [NativeScriptCommonModule, HlmButtonDirective],
  schemas: [NO_ERRORS_SCHEMA],
})
export class SpartanSignUpComponent {}
