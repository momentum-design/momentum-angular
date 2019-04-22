/** @component topbar */

import { Component, Input } from '@angular/core';

export type TopbarColor = 'dark' | 'light' | 'blue';

@Component({
  selector: 'header[md-top-bar]',
  template: `
    <div class="md-top-bar__container">
      <div class="md-top-bar__brand">
        <ng-content select="brand"></ng-content>
      </div>
      <ng-content></ng-content>
    </div>
  `,
  host: {
    'attr.role': 'navigation',
    class: 'md-top-bar',
    '[class.md-top-bar--fixed]': 'fixed',
    '[class.md-top-bar--blue]': 'color === "blue"',
    '[class.md-top-bar--dark]': 'color === "dark"',
    '[class.md-top-bar--light]': 'color === "light"',
  },
})
export class TopbarComponent {
  /** @option Topbar header color | '' */
  @Input() public color: TopbarColor;
  /** @option Determines if Topbar is fixed to top | false */
  @Input() public fixed: boolean;
}
