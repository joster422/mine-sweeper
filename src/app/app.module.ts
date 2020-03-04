import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { FormControlModule } from '@joster/form-control';

import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { CellComponent } from './game/cell/cell.component';
import { FormComponent } from './game/form/form.component';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    FormComponent,
    CellComponent
  ],
  imports: [
    BrowserModule,
    FormControlModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
