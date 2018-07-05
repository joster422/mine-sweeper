import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { GameComponent } from "./game/game.component";
import { MineService } from "./mine.service";
import { SweeperService } from "./sweeper.service";

@NgModule({
  declarations: [AppComponent, GameComponent],
  imports: [BrowserModule],
  providers: [MineService, SweeperService],
  bootstrap: [AppComponent]
})
export class AppModule {}
