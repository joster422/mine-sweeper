import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IconModule } from '@joster-dev/icon';

import { CellComponent } from './cell/cell.component';
import { GameComponent } from './game.component';
import { FormModule } from './form/form.module';

@NgModule({
  declarations: [
    CellComponent,
    GameComponent
  ],
  imports: [
    CommonModule,
    FormModule,
    IconModule
  ],
  exports: [
    GameComponent
  ]
})
export class GameModule { }
