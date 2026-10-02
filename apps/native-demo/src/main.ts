import { IMAGE_CONFIG } from '@angular/common';
import { provideZonelessChangeDetection } from '@angular/core';
import { install as installDrawer } from '@nativescript-community/ui-drawer';
import { install as installBottomSheet } from '@nativescript-community/ui-material-bottomsheet';
import {
	bootstrapApplication,
	provideNativeScriptRouter,
	registerElement,
	runNativeScriptAngularApp,
} from '@nativescript/angular';
import { installMasonKit, masonMeta } from '@triniwiz/nativescript-masonkit/angular';
import { Div } from '@triniwiz/nativescript-masonkit/web';
import { AppComponent } from './app.component';
import { routes } from './app.routes';

installMasonKit({ componentHosts: { passthrough: [/-page$/] } });
// Spartan buttons are inline-flex boxes (items-center, gap). MasonKit's Button lays its children out as text runs
// and ignores flex, so icons sit on the text baseline with no gap; a block element takes the flex classes.
registerElement('button', () => Div, masonMeta);
installDrawer();
installBottomSheet();

runNativeScriptAngularApp({
	appModuleBootstrap: () =>
		bootstrapApplication(AppComponent, {
			providers: [
				provideNativeScriptRouter(routes),
				provideZonelessChangeDetection(),
				// Angular's dev-mode image checks read the DOM document, which NativeScript does not have.
				{ provide: IMAGE_CONFIG, useValue: { disableImageSizeWarning: true, disableImageLazyLoadWarning: true } },
			],
		}),
});
