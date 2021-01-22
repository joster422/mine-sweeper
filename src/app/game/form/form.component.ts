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

  clickDifficulty(value: 1 | 2 | 3): void {
    switch (value) {
      case 1:
        this.model.rows = 8;
        this.model.columns = 8;
        this.model.mines = 10;
        break;
      case 2:
        this.model.rows = 12;
        this.model.columns = 12;
        this.model.mines = 24;
        break;
      case 3:
        this.model.rows = 30;
        this.model.columns = 16;
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
