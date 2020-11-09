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
  @Input() disabled = false;

  @Output() restart = new EventEmitter();

  restart$ = new Subject();
  booleans = [
    { key: true, value: 'Yes' },
    { key: false, value: 'No' }
  ];
  botSpeeds = [
    { key: 1, value: 'Slow' },
    { key: 2, value: 'Normal' },
    { key: 3, value: 'Fast' }
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

  clickDifficulty(value: 1 | 2 | 3): void {
    switch (value) {
      case 1:
        this.model.rows = 10;
        this.model.columns = 10;
        this.model.mines = 15;
        break;
      case 2:
        this.model.rows = 15;
        this.model.columns = 15;
        this.model.mines = 30;
        break;
      case 3:
        this.model.rows = 54;
        this.model.columns = 36;
        this.model.mines = 200;
        break;
    }
    this.restart$.next();
  }

  get minRows(): number {
    return 2;
  }

  get maxRows(): number {
    return 100;
  }

  get maxMines(): number {
    if (!this.model.rows || !this.model.columns)
      return 10;
    return this.model.rows * this.model.columns - 1;
  }

  get minColumns(): number {
    return 2;
  }

  get maxColumns(): number {
    return 100;
  }
}
