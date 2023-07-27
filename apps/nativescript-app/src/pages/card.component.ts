import { CUSTOM_ELEMENTS_SCHEMA, Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/nativescript-ui-button-helm';
import {
  HlmCardDirective,
  HlmCardContentDirective,
  HlmCardDescriptionDirective,
  HlmCardFooterDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
} from '@spartan-ng/ui-card-helm';

@Component({
  selector: 'spartan-card',
  template: `
    <ActionBar title="Spartan Card" flat="true">
      <NavigationButton text="Back" android.systemIcon="ic_menu_back"></NavigationButton>
    </ActionBar>

    <StackLayout class="p-4">
      <StackLayout class="max-w-lg mx-auto" hlmCard>
        <StackLayout hlmCardHeader orientation="horizontal">
          <Label hlmCardTitle>AngularGPT</Label>
          <Label hlmCardDescription>
            beta
            <!-- <span variant='secondary' hlmBadge>beta</span> -->
          </Label>
        </StackLayout>
        <StackLayout hlmCardContent>
          <Label class="block" hlmLabel>E-mail</Label>
          <TextField class="w-full mt-1.5" placeholder="you@spartan-ng" hlmInput></TextField>

          <Label class="block my-4" hlmLabel>Password</Label>
          <TextField class="w-full mt-1.5" type="password" hlmInput></TextField>
        </StackLayout>
        <StackLayout hlmCardFooter direction="column">
          <Button hlmBtn>Sign In</Button>
          <Button hlmBtn variant="ghost">Create Account</Button>
        </StackLayout>
      </StackLayout>
    </StackLayout>
  `,
  standalone: true,
  imports: [
    HlmButtonDirective,
    HlmCardDirective,
    HlmCardContentDirective,
    HlmCardDescriptionDirective,
    HlmCardFooterDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class SpartanCardShowcaseComponent {}
