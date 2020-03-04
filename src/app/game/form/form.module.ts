
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FormControlModule } from '@joster/form-control';

import { FormComponent } from './form.component';

@NgModule({
  declarations: [
    FormComponent
  ],
  imports: [
    CommonModule,
    FormControlModule,
    FormsModule
  ],
  exports: [
    FormComponent
  ]
})
export class FormModule { }
