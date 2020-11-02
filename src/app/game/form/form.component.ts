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
    this.model.rows = 5;
    this.model.columns = 5;
    this.model.mines = 5;
  }

  // get percentMines(): string {
  //   if (!this.model.columns || !this.model.rows || !this.model.mines)
  //     return '0';
  //   return (this.model.mines / (this.model.rows * this.model.columns) * 100).toFixed(0);
  // }

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
