import { Component } from '@angular/core';
import { Application, Color, isIOS } from '@nativescript/core';

@Component({
  selector: 'app-root',
  template: `
    <RootLayout>
      <page-router-outlet></page-router-outlet>
    </RootLayout>
  `,
})
export class AppComponent {
  constructor() {
    if (isIOS) {
      const window = Application.ios.window;
      window.backgroundColor = new Color('#791e20').ios;
      window.tintColor = UIColor.blackColor;
    }
  }
}
