import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { MineSweeperComponent } from './mine-sweeper/mine-sweeper.component';

import { MineSweeperService } from './mine-sweeper.service';


@NgModule({
  declarations: [
    AppComponent,
    MineSweeperComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    MineSweeperService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }