import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'example-select-default',
  template: `
    <div class="medium-8 columns">
      <md-select
        [options]="people"
        [(ngModel)]="person"
        placeholder="Select an option"
        (handleChange)="onChange($event)"
        optionLabel="name"
        buttonClass="custom-button-class"
        [buttonStyle]="{width: '80%'}"
        scrollHeight="350px"
        overlayClass="testOverlayClass" >
      </md-select>
    </div>

  <p> ngModel: {{person ? person.name : 'none'}} <p>
  `,
  styles: []
})
export class SelectDefaultComponent {

  person = {name: 'Steve Nash', initial: 'SN'};
  people;

  constructor() {
    this.people = [
      {name: 'John Jones', initial: 'JJ'},
      {name: 'Lebron James', initial: 'LJ'},
      {name: 'Dwayne Wade', initial: 'DW'},
      {name: 'John Paul Jones', initial: 'JPJ'},
      {name: 'Hannah Brown', initial: 'HB'},
      {name: 'Kobe Bryant', initial: 'KB'},
      {name: 'Tim Duncan', initial: 'TD'},
      {name: 'Reggie Miller', initial: 'RM'},
      {name: 'Steph Curry', initial: 'SC'},
      {name: 'Steve Nash', initial: 'SN'},
      {name: 'James Harden', initial: 'JH'},
    ];
  }

  onChange(e) {
    console.info(e.value);
  }
}
