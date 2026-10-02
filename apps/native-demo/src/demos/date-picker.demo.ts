import { Component, ElementRef, NO_ERRORS_SCHEMA, computed, inject, signal, viewChild } from '@angular/core';
import type { View } from '@nativescript/core';
import { DateTimePicker } from '@nativescript/datetimepicker';
import { buttonVariants } from '@spartan-ng/helm/button';
import { hlm } from '@spartan-ng/helm/utils';
import { Icon } from '../ui/icon';
import { type OverlayRef, Overlays } from '../ui/overlays';

const MONTHS = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];
const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const sameDay = (a: Date, b: Date | null) =>
	!!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

@Component({
	selector: 'date-picker-demo',
	imports: [Icon],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<div
			role="group"
			data-slot="field"
			data-orientation="vertical"
			class="spartan-field group/field spartan-field-orientation-vertical flex w-full flex-col"
		>
			<label
				data-slot="field-label"
				class="spartan-label spartan-field-label group/field-label peer/field-label flex w-fit items-center select-none"
			>
				Date of birth
			</label>
			<div
				#trigger
				role="button"
				data-slot="date-picker-trigger"
				[class]="_triggerClass"
				[attr.data-placeholder]="_selected() ? null : ''"
				[attr.aria-expanded]="_open()"
				(click)="openCalendar()"
			>
				<span class="truncate">{{ _selected()?.toDateString() ?? 'Pick a date' }}</span>
				<ui-icon name="lucideChevronDown" />
			</div>
		</div>

		<div
			role="group"
			data-slot="field"
			data-orientation="vertical"
			class="spartan-field group/field spartan-field-orientation-vertical flex w-full flex-col"
		>
			<label
				data-slot="field-label"
				class="spartan-label spartan-field-label group/field-label peer/field-label flex w-fit items-center select-none"
			>
				Native date dialog
			</label>
			<div
				#nativeTrigger
				role="button"
				data-slot="date-picker-trigger"
				[class]="_triggerClass"
				[attr.data-placeholder]="_selected() ? null : ''"
				(click)="pickNative()"
			>
				<span class="truncate">{{ _selected()?.toDateString() ?? 'Pick a date' }}</span>
				<ui-icon name="lucideCalendar" />
			</div>
		</div>

		<ng-template #panel>
			<div
				data-slot="popover-content"
				data-state="open"
				data-side="bottom"
				class="spartan-popover-content relative flex w-72 flex-col p-0"
			>
				<div
					data-slot="calendar"
					class="spartan-calendar group/calendar bg-background block w-full rounded-none border-0"
				>
					<div class="flex flex-col gap-4">
						<div class="flex w-full flex-row items-center justify-between gap-1.5">
							<button [class]="_navButton" aria-label="Go to the previous month" (click)="shift(-1)">
								<ui-icon name="lucideChevronLeft" />
							</button>
							<span class="text-sm font-medium">{{ _heading() }}</span>
							<button [class]="_navButton" aria-label="Go to the next month" (click)="shift(1)">
								<ui-icon name="lucideChevronRight" />
							</button>
						</div>
						<div role="grid" class="grid w-full grid-cols-7 gap-y-2">
							@for (weekday of _weekdays; track weekday) {
								<span class="text-muted-foreground text-center text-[0.8rem] font-normal select-none">
									{{ weekday }}
								</span>
							}
							@for (day of _days(); track day.date.getTime()) {
								<div
									role="gridcell"
									class="group/day relative aspect-square h-full w-full p-0 text-center select-none"
									[attr.data-selected]="day.selected ? 'true' : null"
								>
									<button
										[class]="_dayButton"
										[attr.data-selected-single]="day.selected ? 'true' : null"
										[attr.data-today]="day.today && !day.selected ? 'true' : null"
										[attr.data-outside]="day.outside && !day.selected ? 'true' : null"
										(click)="select(day.date)"
									>
										{{ day.date.getDate() }}
									</button>
								</div>
							}
						</div>
					</div>
				</div>
			</div>
		</ng-template>
	`,
})
export default class DatePickerDemo {
	private readonly _overlays = inject(Overlays);
	private readonly _trigger = viewChild.required('trigger', { read: ElementRef<View> });
	private readonly _panel = viewChild.required<Parameters<Overlays['open']>[0]>('panel');
	private readonly _nativeTrigger = viewChild.required('nativeTrigger', { read: ElementRef<View> });
	private readonly _ref = signal<OverlayRef | null>(null);
	protected readonly _open = computed(() => this._overlays.isOpen(this._ref()));
	protected readonly _triggerClass = hlm(
		buttonVariants({ variant: 'outline' }),
		'spartan-date-picker-trigger w-64 flex-row justify-between',
	);

	protected readonly _weekdays = WEEKDAYS;
	private readonly _today = new Date();
	protected readonly _selected = signal<Date | null>(null);
	protected readonly _month = signal(new Date(this._today.getFullYear(), this._today.getMonth(), 1));
	protected readonly _heading = computed(() => `${MONTHS[this._month().getMonth()]} ${this._month().getFullYear()}`);
	protected readonly _days = computed(() => {
		const month = this._month();
		const first = new Date(month.getFullYear(), month.getMonth(), 1 - month.getDay());
		const inMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
		const count = Math.ceil((month.getDay() + inMonth) / 7) * 7;
		return Array.from({ length: count }, (_, i) => {
			const date = new Date(first.getFullYear(), first.getMonth(), first.getDate() + i);
			return {
				date,
				outside: date.getMonth() !== month.getMonth(),
				today: sameDay(date, this._today),
				selected: sameDay(date, this._selected()),
			};
		});
	});

	protected readonly _navButton = hlm(buttonVariants({ variant: 'ghost' }), 'size-8 p-0 select-none');
	protected readonly _dayButton = hlm(
		buttonVariants({ variant: 'ghost', size: 'icon' }),
		'data-[today=true]:bg-muted data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground relative isolate z-10 flex aspect-square size-auto w-full flex-col gap-1 border-0 leading-none font-normal',
		'data-[outside=true]:opacity-50',
	);

	protected openCalendar() {
		const selected = this._selected() ?? this._today;
		this._month.set(new Date(selected.getFullYear(), selected.getMonth(), 1));
		this._ref.set(
			this._overlays.open(this._panel(), {
				kind: 'anchored',
				anchor: this._trigger().nativeElement,
				side: 'bottom',
				align: 'start',
			}),
		);
	}

	/** The platform's own date dialog (DatePickerDialog / UIDatePicker), sharing the popover's selection. */
	protected async pickNative() {
		const date = await DateTimePicker.pickDate({
			context: this._nativeTrigger().nativeElement._context,
			date: this._selected() ?? this._today,
			okButtonText: 'OK',
			cancelButtonText: 'Cancel',
		});
		if (date) this.select(date);
	}

	protected shift(months: number) {
		const month = this._month();
		this._month.set(new Date(month.getFullYear(), month.getMonth() + months, 1));
	}

	protected select(date: Date) {
		this._selected.set(date);
		this._month.set(new Date(date.getFullYear(), date.getMonth(), 1));
	}
}
