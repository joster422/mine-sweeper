import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";

import { GameComponent } from "./game/game.component";
import { MenuComponent } from "./menu/menu.component";

@NgModule({
  declarations: [AppComponent, GameComponent, MenuComponent],
  imports: [BrowserModule, FormsModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
