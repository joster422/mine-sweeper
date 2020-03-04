import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
    FormModule
  ],
  exports: [
    GameComponent
  ]
})
export class GameModule { }
