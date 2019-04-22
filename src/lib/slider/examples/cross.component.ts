import { Component } from '@angular/core';
import { SliderChange } from '@momentum-ui/angular/slider';

@Component({
  selector: 'example-slider-cross',
  template: `
    <div>
      {{ label }}
    </div>
    <md-slider
      [(ngModel)]="value"
      max="500"
      tick="100"
      [canCross]="true"
      (change)="change($event)"
    ></md-slider>
  `,
})
export class ExampleSliderCrossComponent {
  value: SliderChange = { high: 300, low: 100 };
  get label(): string {
    return `Low: ${this.value.low} High: ${this.value.high}`;
  }

  change(event: SliderChange) {
    console.info(event);
  }
}
