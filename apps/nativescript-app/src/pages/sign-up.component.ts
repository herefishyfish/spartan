import { Component, NO_ERRORS_SCHEMA, inject } from '@angular/core';
import { NativeDialogRef, NativeScriptCommonModule, RouterExtensions } from '@nativescript/angular';
import { HlmButtonDirective } from '@spartan-ng/nativescript-ui-button-helm';

@Component({
  selector: 'spartan-sign-up',
  template: `
    <GridLayout rows="auto * auto" class="p-10 bg-white dark:bg-black">
      <Label class="h1">Create an account!</Label>
      <StackLayout row="2">
        <Button class="my-1" (tap)="goBack()" variant="outline" hlmBtn>Sign Up</Button>
        <Button class="my-1" (tap)="goBack()" variant="ghost" hlmBtn>Cancel</Button>
      </StackLayout>
    </GridLayout>
  `,
  standalone: true,
  imports: [NativeScriptCommonModule, HlmButtonDirective],
  schemas: [NO_ERRORS_SCHEMA],
})
export class SpartanSignUpComponent {
  private readonly ref = inject(NativeDialogRef);

  goBack(): void {
    this.ref.close();
  }
}
