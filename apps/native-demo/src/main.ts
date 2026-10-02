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
import { Div, Span } from '@triniwiz/nativescript-masonkit/web';
import { AppComponent } from './app.component';
import { routes } from './app.routes';
import './native-globals';
import { provideSpartanNativeScript } from './spartan-native';

installMasonKit({ componentHosts: { passthrough: [/-page$/] } });
// Spartan buttons are inline-flex boxes (items-center, gap). MasonKit's Button lays its children out as text runs
// and ignores flex, so icons sit on the text baseline with no gap; a block element takes the flex classes.
registerElement('button', () => Div, masonMeta);
// The @ng-icons/core shim draws a glyph, so its host is text that can sit inside other text elements.
registerElement('ng-icon', () => Span, masonMeta);
installDrawer();
installBottomSheet();

runNativeScriptAngularApp({
	appModuleBootstrap: () =>
		bootstrapApplication(AppComponent, {
			providers: [provideNativeScriptRouter(routes), provideZonelessChangeDetection(), provideSpartanNativeScript()],
		}),
});
