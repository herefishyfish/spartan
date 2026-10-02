import { Component, NO_ERRORS_SCHEMA, computed, signal } from '@angular/core';
import { buttonVariants } from '@spartan-ng/helm/button';
import { Icon } from '../ui/icon';

const SLOT = 'spartan-input-otp-slot relative flex items-center justify-center';
const ACTIVE = 'z-10 border-ring ring-3 ring-ring/50';
const INVALID = 'border-destructive';
const CODE = '123456';
const LENGTH = CODE.length;

@Component({
	selector: 'input-otp-demo',
	imports: [Icon],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">With separator</h3>
			<div data-slot="input-otp" class="spartan-input-otp relative flex w-fit flex-row items-center">
				@for (group of _groups; track $index; let lastGroup = $last) {
					<div data-slot="input-otp-group" class="spartan-input-otp-group flex flex-row items-center">
						@for (index of group; track index) {
							<div data-slot="input-otp-slot" [class]="slotClass(_otp(), index, false)">
								<span>{{ _otp()[index] }}</span>
								@if (index === _otp().length) {
									<div
										class="spartan-input-otp-caret pointer-events-none absolute inset-0 flex items-center justify-center"
									>
										<div class="spartan-input-otp-caret-line"></div>
									</div>
								}
							</div>
						}
					</div>
					@if (!lastGroup) {
						<div role="separator" data-slot="input-otp-separator" class="spartan-input-otp-separator flex items-center">
							<ui-icon name="lucideMinus" />
						</div>
					}
				}
				<input type="number" class="absolute inset-0 opacity-0" [value]="_otp()" (input)="_otp.set(digits($event))" />
			</div>
			<p class="text-muted-foreground text-sm">
				{{ _otp().length === 6 ? 'Entered ' + _otp() : 'Tap the slots and type 6 digits' }}
			</p>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Verification</h3>
			<div data-slot="input-otp" class="spartan-input-otp relative flex w-fit flex-row items-center">
				<div data-slot="input-otp-group" class="spartan-input-otp-group flex flex-row items-center">
					@for (index of _pinSlots; track index) {
						<div
							data-slot="input-otp-slot"
							[class]="slotClass(_pin(), index, _invalid())"
							[attr.data-matches-spartan-invalid]="_invalid() ? 'true' : null"
						>
							<span>{{ _pin()[index] }}</span>
						</div>
					}
				</div>
				<input type="number" class="absolute inset-0 opacity-0" [value]="_pin()" (input)="_pin.set(digits($event))" />
			</div>
			@if (_invalid()) {
				<p role="alert" data-slot="field-error" class="spartan-field-error font-normal">
					Invalid code. Try {{ _code }}.
				</p>
			} @else if (_pin() === _code) {
				<p class="text-sm font-medium">Verified</p>
			} @else {
				<p class="text-muted-foreground text-sm">Enter the code sent to your phone.</p>
			}
			<button [class]="_outline" (click)="_pin.set('')">Clear</button>
		</section>
	`,
})
export default class InputOtpDemo {
	protected readonly _groups = [
		[0, 1],
		[2, 3],
		[4, 5],
	];
	protected readonly _pinSlots = [0, 1, 2, 3, 4, 5];
	protected readonly _code = CODE;
	protected readonly _otp = signal('');
	protected readonly _pin = signal('');
	protected readonly _invalid = computed(() => this._pin().length === LENGTH && this._pin() !== CODE);
	protected readonly _outline = buttonVariants({ variant: 'outline', size: 'sm' });

	protected slotClass(value: string, index: number, invalid: boolean) {
		const active = index === Math.min(value.length, LENGTH - 1);
		return [SLOT, active && ACTIVE, invalid && INVALID].filter(Boolean).join(' ');
	}

	protected digits(event: Event) {
		const target = (event as unknown as { target: { value: string } }).target;
		const value = String(target.value ?? '')
			.replace(/\D/g, '')
			.slice(0, LENGTH);
		if (target.value !== value) target.value = value;
		return value;
	}
}
