import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { Form } from './form';

@Component({
  selector: 'ms-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit, OnDestroy {
  @Input() model!: Form;

  @Output() restart = new EventEmitter();

  restart$ = new Subject();
  booleans = [
    { key: true, value: 'Yes' },
    { key: false, value: 'No' }
  ];

  constructor() { }

  ngOnInit() {
    this.restart$
      .pipe(debounceTime(500))
      .subscribe(() => this.restart.emit());
  }

  ngOnDestroy() {
    this.restart$.complete();
  }
}
