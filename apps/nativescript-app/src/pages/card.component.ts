import { isAndroid } from '@nativescript/core';
import { CUSTOM_ELEMENTS_SCHEMA, Component, NO_ERRORS_SCHEMA, inject } from '@angular/core';
import { NativeDialogService, NativeScriptCommonModule, RouterExtensions } from '@nativescript/angular';
import { HlmButtonDirective } from '@spartan-ng/nativescript-ui-button-helm';
import { HlmInputDirective } from '@spartan-ng/nativescript-ui-input-helm';
import { BrnSeparatorComponent } from '@spartan-ng/nativescript-ui-separator-brain';
import {
  HlmCardDirective,
  HlmCardContentDirective,
  HlmCardDescriptionDirective,
  HlmCardFooterDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
} from '@spartan-ng/ui-card-helm';
import { HlmBadgeDirective } from '@spartan-ng/ui-badge-helm';
import { HlmSeparatorDirective } from '@spartan-ng/ui-separator-helm';

import { SpartanSignUpComponent } from './sign-up.component';

@Component({
  selector: 'spartan-card',
  template: `
    <ActionBar title="Spartan Card" flat="true">
      <NavigationButton text="Back" (tap)="router.back()" android.systemIcon="ic_menu_back"></NavigationButton>
    </ActionBar>

    <StackLayout class="p-4">
      <StackLayout class="max-w-lg mx-auto" hlmCard>
        <StackLayout hlmCardHeader orientation="horizontal">
          <Label hlmCardTitle class="mr-2">AngularGPT</Label>
          <Label variant="secondary" hlmBadge> beta </Label>
        </StackLayout>
        <StackLayout hlmCardContent>
          <Label class="block" hlmLabel>E-mail</Label>
          <TextField class="w-full mt-1.5" placeholder="you@spartan-ng" hlmInput></TextField>

          <Label class="block mt-4" hlmLabel>Password</Label>
          <TextField class="w-full mt-1.5" [secure]="true" hlmInput></TextField>
        </StackLayout>
        <brn-separator hlmSeparator seperatorOrientation="horizontal" class="mb-6" />
        <StackLayout hlmCardFooter direction="column">
          <Button hlmBtn>Sign In</Button>
          <Button hlmBtn variant="ghost" (tap)="createAccount()">Create Account</Button>
        </StackLayout>
      </StackLayout>
    </StackLayout>
  `,
  standalone: true,
  imports: [
    NativeScriptCommonModule,
    BrnSeparatorComponent,
    HlmSeparatorDirective,
    HlmButtonDirective,
    HlmBadgeDirective,
    HlmCardDirective,
    HlmCardContentDirective,
    HlmCardDescriptionDirective,
    HlmCardFooterDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
    HlmInputDirective,
  ],
  providers: [NativeDialogService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class SpartanCardPage {
  public router = inject(RouterExtensions);
  private dialog = inject(NativeDialogService);

  createAccount() {
    this.dialog.open(SpartanSignUpComponent, {
      nativeOptions: {
        fullscreen: isAndroid ? true : false,
      },
    });
  }
}
