
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FormControlModule } from '@joster-dev/form-control';
import { IconModule } from '@joster-dev/icon';

import { FormComponent } from './form.component';

@NgModule({
  declarations: [
    FormComponent
  ],
  imports: [
    CommonModule,
    FormControlModule,
    FormsModule,
    IconModule
  ],
  exports: [
    FormComponent
  ]
})
export class FormModule { }
