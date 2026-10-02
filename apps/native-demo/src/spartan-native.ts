import { Platform } from '@angular/cdk/platform';
import { DOCUMENT, IMAGE_CONFIG } from '@angular/common';
import {
	type EnvironmentProviders,
	inject,
	makeEnvironmentProviders,
	provideEnvironmentInitializer,
} from '@angular/core';
import { registerElement } from '@nativescript/angular';
import { masonMeta } from '@triniwiz/nativescript-masonkit/angular';
import { Div, Span } from '@triniwiz/nativescript-masonkit/web';

/**
 * CDK reads `isBrowser` from PLATFORM_ID, which NativeScript reports as 'browser', and then reaches for `window`
 * and `document` listeners (FocusMonitor, InputModalityDetector, ...). Reporting no browser sends every CDK
 * service down the path it takes on the server. Built without CDK's constructor, whose field initializers read
 * `navigator`.
 */
function nativePlatform(): Platform {
	return Object.assign(Object.create(Platform.prototype) as Platform, {
		isBrowser: false,
		EDGE: false,
		TRIDENT: false,
		BLINK: false,
		WEBKIT: false,
		IOS: false,
		FIREFOX: false,
		ANDROID: false,
		SAFARI: false,
	});
}

/** Providers spartan's helm and brain libraries need to run on NativeScript views. */
export function provideSpartanNativeScript(): EnvironmentProviders {
	return makeEnvironmentProviders([
		{ provide: Platform, useFactory: nativePlatform },
		provideEnvironmentInitializer(() => {
			// brain looks labels up with document.querySelector; NativeScript's DOCUMENT has no queries.
			const document = inject(DOCUMENT) as Partial<Document>;
			document.querySelector ??= () => null;
			document.querySelectorAll ??= () => [] as unknown as NodeListOf<Element>;
		}),
		// Angular's dev-mode image checks read the DOM document, which NativeScript does not have.
		{ provide: IMAGE_CONFIG, useValue: { disableImageSizeWarning: true, disableImageLazyLoadWarning: true } },
	]);
}

/**
 * Element mappings spartan's markup needs on MasonKit. Call after installMasonKit(), before bootstrap.
 *
 * MasonKit lays out `button`, `a` and `li` as inline text runs that ignore flex, but spartan styles them as flex boxes
 * (buttons and links with icons and gaps, pagination and menu items), so they are backed by a block element.
 * The @ng-icons/core shim draws a glyph, so `ng-icon` is text that can also sit inside helm's text elements.
 */
export function registerSpartanNativeElements(): void {
	for (const tag of ['button', 'a', 'li']) {
		registerElement(tag, () => Div, masonMeta);
	}
	registerElement('ng-icon', () => Span, masonMeta);
}
