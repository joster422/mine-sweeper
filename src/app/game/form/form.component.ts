import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Form } from 'src/app/models';

import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'ms-form[model]',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit, OnDestroy {
  @Input() model!: Form;
  @Input() disabled = false;

  @Output() botStatus = new EventEmitter();
  @Output() restart = new EventEmitter();

  restart$ = new Subject();
  booleans = [
    { key: true, value: 'Yes' },
    { key: false, value: 'No' }
  ];
  botSpeeds = [
    { key: true, value: 'Fast' },
    { key: false, value: 'Slow' },
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

  clickDifficulty(value: number): void {
    const baseRowsColumns = 7 + value;
    const baseMines = 8 * value;
    const randomAdditionArray = [...Array(2).keys()];
    this.model.rows = baseRowsColumns + this.randomFind(randomAdditionArray);
    this.model.columns = baseRowsColumns + this.randomFind(randomAdditionArray);
    this.model.mines = baseMines + this.randomFind(randomAdditionArray);
    this.restart$.next();
  }

  randomFind<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  get minRows(): number {
    return 2;
  }

  get maxRows(): number {
    return 100;
  }

  get minMines(): number {
    if (!this.model.rows || !this.model.columns)
      return 1;
    return Math.floor(0.05 * (this.model.rows * this.model.columns));
  }

  get maxMines(): number {
    if (!this.model.rows || !this.model.columns)
      return 10;
    return Math.floor(0.8 * (this.model.rows * this.model.columns));
  }

  get minColumns(): number {
    return 2;
  }

  get maxColumns(): number {
    return 100;
  }
}
