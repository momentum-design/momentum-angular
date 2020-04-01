import { Component, ViewChild, ElementRef } from '@angular/core';
import { DatePickerComponent } from '@momentum-ui/angular';
let moment = require('moment');
if ('default' in moment) {
  moment = moment['default'];
}

@Component({
  selector: 'example-date-picker-default',
  template: `
    <p class='marginLeft' #dateTitle>Date</p>
    <md-date-picker #datepicker
      [ngClass]="{'custom': true}"
      className='High'
      [backdropClickExit]='false'
      [minDate]='minDate'
      [maxDate]='maxDate'
      [selectedDate]='selectedDate'
      (whenChange)='whenChange($event)'
      (whenMonthChange)='whenMonthChange($event)'
      (whenSelect)='whenSelect($event)'
    >
      <button class='marginLeft' (click)='switchDatePicker()'>Select</button>
    </md-date-picker>
  `,
  styles: [
    '.marginLeft{margin-left:300px;}'
  ]
})
export class ExampleDatePickerDefaultComponent {

  @ViewChild('datepicker') datePickerComponent: DatePickerComponent;
  @ViewChild('dateTitle') dateTitle: ElementRef;

  public selectedDate =  moment().add(5, 'days').clone();
  public minDate =  moment().add(-5, 'days').clone();
  public maxDate = moment().add(10, 'days').clone();

  constructor() {

  }

  private isShow = true;

  public switchDatePicker() {
    this.datePickerComponent.show();
  }

  public whenChange = (e) => {
    // console.log('whenChange', e);
  }
  public whenMonthChange = (e) => {
    // console.log('whenMonthChange', e);
  }
  public whenSelect = (e) => {
    this.dateTitle.nativeElement.innerHTML = e;
    // console.log('whenSelect', e);
  }

}
