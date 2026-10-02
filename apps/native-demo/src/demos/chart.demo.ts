import { Component, NO_ERRORS_SCHEMA, computed, effect, signal } from '@angular/core';
import { BarChart } from '@nativescript-community/ui-chart/charts/BarChart';
import { XAxisPosition } from '@nativescript-community/ui-chart/components/XAxis';
import { BarData } from '@nativescript-community/ui-chart/data/BarData';
import { BarDataSet } from '@nativescript-community/ui-chart/data/BarDataSet';
import { registerElement } from '@nativescript/angular';
import type { EventData } from '@nativescript/core';

registerElement('BarChart', () => BarChart);

const DAYS = [
	222, 97, 167, 242, 373, 301, 245, 409, 59, 261, 327, 292, 342, 137, 120, 138, 446, 364, 243, 89, 137, 224, 138, 387,
	215, 75, 383, 122, 315, 454,
];
const MOBILE = [
	150, 180, 120, 260, 290, 340, 180, 320, 110, 190, 350, 210, 380, 220, 170, 190, 360, 410, 180, 150, 200, 170, 230,
	290, 250, 130, 420, 180, 240, 380,
];

const SERIES = {
	desktop: { label: 'Desktop', color: '#009689', values: DAYS },
	mobile: { label: 'Mobile', color: '#f54a00', values: MOBILE },
} as const;
type SeriesKey = keyof typeof SERIES;

@Component({
	selector: 'chart-demo',
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<div data-slot="card" class="spartan-card flex flex-col">
			<div data-slot="card-header" class="spartan-card-header flex flex-col">
				<h3 data-slot="card-title" class="spartan-card-title">Bar Chart - Interactive</h3>
				<p data-slot="card-description" class="spartan-card-description">Showing total visitors for April 2024</p>
			</div>
			<div class="flex flex-row border-t">
				@for (key of _keys; track key) {
					<div
						role="button"
						class="flex flex-1 flex-col gap-1 px-6 py-4"
						[class.bg-muted]="_active() === key"
						(click)="_active.set(key)"
					>
						<span class="text-muted-foreground text-xs">{{ _series[key].label }}</span>
						<span class="text-2xl font-bold">{{ _totals[key] }}</span>
					</div>
				}
			</div>
			<div data-slot="card-content" class="spartan-card-content">
				<BarChart height="240" (loaded)="onLoaded($any($event))" />
			</div>
		</div>
		<p class="text-muted-foreground text-sm">
			Native MPAndroidChart-style rendering via &#64;nativescript-community/ui-chart.
		</p>
	`,
})
export default class ChartDemo {
	protected readonly _keys = Object.keys(SERIES) as SeriesKey[];
	protected readonly _series = SERIES;
	protected readonly _totals = Object.fromEntries(
		this._keys.map((key) => [key, SERIES[key].values.reduce((sum, value) => sum + value, 0).toLocaleString()]),
	) as Record<SeriesKey, string>;
	protected readonly _active = signal<SeriesKey>('desktop');
	protected readonly _data = computed(() => {
		const { label, color, values } = SERIES[this._active()];
		const set = new BarDataSet(
			values.map((value, index) => ({ x: index + 1, y: value })),
			label,
			'x',
			'y',
		);
		set.color = color;
		set.drawValuesEnabled = false;
		return new BarData([set]);
	});

	private readonly _chart = signal<BarChart | null>(null);

	constructor() {
		effect(() => {
			const chart = this._chart();
			if (!chart) return;
			chart.data = this._data();
			chart.notifyDataSetChanged();
			chart.invalidate();
		});
	}

	protected onLoaded(args: EventData) {
		const chart = args.object as BarChart;
		chart.drawGridBackgroundEnabled = false;
		chart.legend.enabled = false;
		chart.axisRight.enabled = false;
		chart.axisLeft.drawGridLines = false;
		chart.axisLeft.axisMinimum = 0;
		chart.xAxis.position = XAxisPosition.BOTTOM;
		chart.xAxis.drawGridLines = false;
		chart.xAxis.textColor = '#737373';
		chart.dragEnabled = false;
		chart.scaleEnabled = false;
		chart.data = this._data();
		this._chart.set(chart);
	}
}
