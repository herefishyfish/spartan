// organize-imports-ignore
// native-globals must evaluate before any @angular/cdk module.
import './native-globals';
import { provideZonelessChangeDetection } from '@angular/core';
import { install as installDrawer } from '@nativescript-community/ui-drawer';
import { install as installBottomSheet } from '@nativescript-community/ui-material-bottomsheet';
import { bootstrapApplication, provideNativeScriptRouter, runNativeScriptAngularApp } from '@nativescript/angular';
import { installMasonKit } from '@triniwiz/nativescript-masonkit/angular';
import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { provideSpartanNativeScript, registerSpartanNativeElements } from './spartan-native';

installMasonKit({ componentHosts: { passthrough: [/-page$/] } });
registerSpartanNativeElements();
installDrawer();
installBottomSheet();

runNativeScriptAngularApp({
	appModuleBootstrap: () =>
		bootstrapApplication(AppComponent, {
			providers: [provideNativeScriptRouter(routes), provideZonelessChangeDetection(), provideSpartanNativeScript()],
		}),
});
