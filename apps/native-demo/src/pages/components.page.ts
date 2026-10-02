import { Component, NO_ERRORS_SCHEMA, inject } from '@angular/core';
import { NativeScriptCommonModule, RouterExtensions } from '@nativescript/angular';
import { Application } from '@nativescript/core';
import { DEMOS, findDemo } from '../demos/registry';
import { Icon } from '../ui/icon';

/**
 * Opens a demo directly:
 * `adb shell am start -n ng.spartan.nativedemo/com.tns.NativeScriptActivity -e demo <slug>` or
 * `xcrun simctl launch booted ng.spartan.nativedemo -demo <slug>`.
 */
function launchDemoSlug(): string | undefined {
	if (__ANDROID__) {
		return Application.android.startActivity?.getIntent()?.getStringExtra('demo') ?? undefined;
	}
	const args = NSProcessInfo.processInfo.arguments;
	const index = args.indexOfObject('-demo');
	return index !== NSNotFound && index + 1 < args.count ? args.objectAtIndex(index + 1) : undefined;
}

@Component({
	selector: 'components-page',
	imports: [NativeScriptCommonModule, Icon],
	schemas: [NO_ERRORS_SCHEMA],
	template: `
		<ActionBar title="spartan/ui" />
		<ScrollView>
			<div class="style-vega bg-background flex w-full flex-col">
				<div class="flex w-full flex-col gap-1 p-4">
					<p class="text-muted-foreground px-2 pb-2 text-sm">
						{{ _demos.length }} components, rendered natively with MasonKit
					</p>
					@for (demo of _demos; track demo.slug) {
						<div class="flex flex-row items-center justify-between rounded-md px-2 py-3" (click)="open(demo.slug)">
							<span class="text-foreground text-base font-medium">{{ demo.name }}</span>
							<ui-icon name="lucideChevronRight" class="text-muted-foreground" />
						</div>
					}
				</div>
			</div>
		</ScrollView>
	`,
})
export class ComponentsPage {
	private readonly _router = inject(RouterExtensions);
	protected readonly _demos = DEMOS;

	constructor() {
		const slug = launchDemoSlug();
		if (slug && findDemo(slug)) {
			setTimeout(() => this.open(slug));
		}
	}

	protected open(slug: string) {
		this._router.navigate(['/demo', slug]);
	}
}
