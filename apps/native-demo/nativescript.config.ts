import { NativeScriptConfig } from '@nativescript/core';

export default {
	id: 'ng.spartan.nativedemo',
	appPath: 'src',
	appResourcesPath: 'App_Resources',
	cli: {
		packageManager: 'pnpm',
	},
	android: {
		v8Flags: '--expose_gc',
		markingMode: 'none',
	},
} as NativeScriptConfig;
