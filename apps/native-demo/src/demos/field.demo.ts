import { Component, NO_ERRORS_SCHEMA, computed, signal } from '@angular/core';
import { buttonVariants } from '@spartan-ng/helm/button';
import { Icon } from '../ui/icon';

const FIELD_VERTICAL = 'spartan-field group/field flex w-full spartan-field-orientation-vertical flex-col';
const FIELD_HORIZONTAL =
	'spartan-field group/field flex w-full spartan-field-orientation-horizontal flex-row items-center';
const LABEL =
	'spartan-label flex items-center select-none spartan-field-label group/field-label peer/field-label flex w-fit';
const INPUT = 'spartan-input w-full min-w-0 outline-none';

@Component({
	selector: 'field-demo',
	imports: [Icon],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<div data-slot="field-group" class="spartan-field-group group/field-group flex w-full flex-col">
			<fieldset data-slot="field-set" class="spartan-field-set flex flex-col">
				<legend data-slot="field-legend" data-variant="legend" class="spartan-field-legend">Payment Method</legend>
				<p data-slot="field-description" class="spartan-field-description leading-normal font-normal">
					All transactions are secure and encrypted
				</p>
				<div data-slot="field-group" class="spartan-field-group group/field-group flex w-full flex-col">
					<div role="group" data-slot="field" data-orientation="vertical" [class]="_vertical">
						<label data-slot="field-label" [class]="_label">Name on card</label>
						<input
							data-slot="input"
							placeholder="John Doe"
							[class]="_input"
							[value]="_name()"
							(input)="_name.set($any($event).target.value)"
						/>
					</div>
					<div
						role="group"
						data-slot="field"
						data-orientation="vertical"
						[class]="_vertical"
						[attr.data-matches-spartan-invalid]="_cardInvalid() ? 'true' : null"
					>
						<label data-slot="field-label" [class]="_label">Card number</label>
						<input
							data-slot="input"
							type="number"
							placeholder="1234 1234 1234 1234"
							[class]="_input"
							[attr.data-matches-spartan-invalid]="_cardInvalid() ? 'true' : null"
							[value]="_card()"
							(input)="_card.set($any($event).target.value)"
						/>
						@if (_cardInvalid()) {
							<p role="alert" data-slot="field-error" class="spartan-field-error font-normal">
								Card number must be 16 digits ({{ _card().length }}/16)
							</p>
						} @else {
							<p data-slot="field-description" class="spartan-field-description leading-normal font-normal">
								Enter your 16-digit card number
							</p>
						}
					</div>
					<div class="flex flex-row gap-4">
						<div role="group" data-slot="field" data-orientation="vertical" [class]="_vertical + ' flex-1'">
							<label data-slot="field-label" [class]="_label">Expires</label>
							<input data-slot="input" placeholder="MM/YY" [class]="_input" />
						</div>
						<div role="group" data-slot="field" data-orientation="vertical" [class]="_vertical + ' flex-1'">
							<label data-slot="field-label" [class]="_label">CVV</label>
							<input data-slot="input" type="number" placeholder="123" [class]="_input" />
						</div>
					</div>
				</div>
			</fieldset>
			<div data-slot="field-separator" class="spartan-field-separator relative">
				<div
					data-slot="separator"
					data-orientation="horizontal"
					class="spartan-separator absolute inset-0 top-1/2 h-px w-full"
				></div>
				<span
					data-slot="field-separator-content"
					class="spartan-field-separator-content bg-background relative mx-auto block w-fit"
				>
					Billing
				</span>
			</div>
			<fieldset data-slot="field-set" class="spartan-field-set flex flex-col">
				<legend data-slot="field-legend" data-variant="legend" class="spartan-field-legend">Billing Address</legend>
				<p data-slot="field-description" class="spartan-field-description leading-normal font-normal">
					The billing address associated with your payment method
				</p>
				<div data-slot="field-group" class="spartan-field-group group/field-group flex w-full flex-col">
					<div
						role="group"
						data-slot="field"
						data-orientation="horizontal"
						[class]="_horizontal"
						(click)="_sameAsShipping.set(!_sameAsShipping())"
					>
						<div
							role="checkbox"
							data-slot="checkbox"
							class="spartan-checkbox peer shrink-0 cursor-default outline-none"
							[attr.data-state]="_sameAsShipping() ? 'checked' : 'unchecked'"
						>
							@if (_sameAsShipping()) {
								<div class="spartan-checkbox-indicator flex items-center justify-center">
									<ui-icon name="lucideCheck" />
								</div>
							}
						</div>
						<label data-slot="field-label" [class]="_label + ' flex-auto'">Same as shipping address</label>
					</div>
					@if (!_sameAsShipping()) {
						<div role="group" data-slot="field" data-orientation="vertical" [class]="_vertical">
							<label data-slot="field-label" [class]="_label">Street address</label>
							<input data-slot="input" placeholder="123 Main St" [class]="_input" />
						</div>
					}
				</div>
			</fieldset>
			<fieldset data-slot="field-set" class="spartan-field-set flex flex-col">
				<div data-slot="field-group" class="spartan-field-group group/field-group flex w-full flex-col">
					<div role="group" data-slot="field" data-orientation="vertical" [class]="_vertical">
						<label data-slot="field-label" [class]="_label">Comments</label>
						<textarea
							data-slot="textarea"
							placeholder="Add any additional comments"
							class="spartan-textarea flex min-h-16 w-full resize-none outline-none"
						></textarea>
					</div>
				</div>
			</fieldset>
			<div role="group" data-slot="field" data-orientation="horizontal" [class]="_horizontal">
				<button [class]="_primary" [attr.data-disabled]="_canSubmit() ? null : ''" (click)="_submitted.set(true)">
					Submit
				</button>
				<button [class]="_outline" (click)="reset()">Cancel</button>
			</div>
			@if (_submitted()) {
				<p class="text-muted-foreground text-sm">Saved card for {{ _name() }}</p>
			}
		</div>
	`,
})
export default class FieldDemo {
	protected readonly _vertical = FIELD_VERTICAL;
	protected readonly _horizontal = FIELD_HORIZONTAL;
	protected readonly _label = LABEL;
	protected readonly _input = INPUT;
	protected readonly _primary = buttonVariants({});
	protected readonly _outline = buttonVariants({ variant: 'outline' });

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
