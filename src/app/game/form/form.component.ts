import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { NgForm } from '@angular/forms';

import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { Form } from './form';

@Component({
  selector: 'ms-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit, OnDestroy {
  @ViewChild('form') form!: NgForm;

  @Input() model!: Form;

  @Output() restart = new EventEmitter();

  restartSubject = new Subject();

  constructor() { }

  ngOnInit() {
    this.restartSubject
      .pipe(debounceTime(500))
      .subscribe(() => this.restart.emit());

    this.form.valueChanges!
      .subscribe(() => this.restartSubject.next());
  }

  ngOnDestroy() {
    this.restartSubject.complete();
  }
}
