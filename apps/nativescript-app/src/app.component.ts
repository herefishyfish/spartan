import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <RootLayout>
      <page-router-outlet></page-router-outlet>
    </RootLayout>
  `,
})
export class AppComponent {}
