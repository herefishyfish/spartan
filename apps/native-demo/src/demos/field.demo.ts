import { Component, NO_ERRORS_SCHEMA, computed, signal } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCheckbox } from '@spartan-ng/helm/checkbox';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmTextarea } from '@spartan-ng/helm/textarea';

@Component({
	selector: 'field-demo',
	imports: [HlmFieldImports, HlmButton, HlmCheckbox, HlmInput, HlmTextarea],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<div hlmFieldGroup>
			<fieldset hlmFieldSet>
				<legend hlmFieldLegend>Payment Method</legend>
				<p hlmFieldDescription>All transactions are secure and encrypted</p>
				<div hlmFieldGroup>
					<div hlmField>
						<label hlmFieldLabel>Name on card</label>
						<input hlmInput placeholder="John Doe" [value]="_name()" (input)="_name.set($any($event).target.value)" />
					</div>
					<div hlmField [forceInvalid]="_cardInvalid()">
						<label hlmFieldLabel>Card number</label>
						<input
							hlmInput
							type="number"
							placeholder="1234 1234 1234 1234"
							[forceInvalid]="_cardInvalid()"
							[value]="_card()"
							(input)="_card.set($any($event).target.value)"
						/>
						@if (_cardInvalid()) {
							<hlm-field-error forceShow>Card number must be 16 digits ({{ _card().length }}/16)</hlm-field-error>
						} @else {
							<p hlmFieldDescription>Enter your 16-digit card number</p>
						}
					</div>
					<div class="flex flex-row gap-4">
						<div hlmField class="flex-1">
							<label hlmFieldLabel>Expires</label>
							<input hlmInput placeholder="MM/YY" />
						</div>
						<div hlmField class="flex-1">
							<label hlmFieldLabel>CVV</label>
							<input hlmInput type="number" placeholder="123" />
						</div>
					</div>
				</div>
			</fieldset>
			<hlm-field-separator>Billing</hlm-field-separator>
			<fieldset hlmFieldSet>
				<legend hlmFieldLegend>Billing Address</legend>
				<p hlmFieldDescription>The billing address associated with your payment method</p>
				<div hlmFieldGroup>
					<div hlmField orientation="horizontal">
						<hlm-checkbox
							inputId="same-as-shipping"
							[checked]="_sameAsShipping()"
							(checkedChange)="_sameAsShipping.set($event)"
						/>
						<!-- A native label does not forward taps to its control the way <label for> does. -->
						<label hlmFieldLabel for="same-as-shipping" (click)="_sameAsShipping.set(!_sameAsShipping())">
							Same as shipping address
						</label>
					</div>
					@if (!_sameAsShipping()) {
						<div hlmField>
							<label hlmFieldLabel>Street address</label>
							<input hlmInput placeholder="123 Main St" />
						</div>
					}
				</div>
			</fieldset>
			<fieldset hlmFieldSet>
				<div hlmFieldGroup>
					<div hlmField>
						<label hlmFieldLabel>Comments</label>
						<textarea hlmTextarea placeholder="Add any additional comments" class="resize-none"></textarea>
					</div>
				</div>
			</fieldset>
			<div hlmField orientation="horizontal">
				<button hlmBtn [disabled]="!_canSubmit()" (click)="_submitted.set(true)">Submit</button>
				<button hlmBtn variant="outline" (click)="reset()">Cancel</button>
			</div>
			@if (_submitted()) {
				<p class="text-muted-foreground text-sm">Saved card for {{ _name() }}</p>
			}
		</div>
	`,
})
export default class FieldDemo {
	protected readonly _name = signal('');
	protected readonly _card = signal('');
	protected readonly _sameAsShipping = signal(true);
	protected readonly _submitted = signal(false);
	protected readonly _cardInvalid = computed(() => this._card().length > 0 && this._card().length !== 16);
	protected readonly _canSubmit = computed(() => this._name().trim().length > 0 && this._card().length === 16);

	protected reset() {
		this._name.set('');
		this._card.set('');
		this._submitted.set(false);
	}
}
