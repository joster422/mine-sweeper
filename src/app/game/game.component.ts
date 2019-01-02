import { Component, OnInit, HostBinding } from "@angular/core";
import { DomSanitizer, SafeStyle } from "@angular/platform-browser";

import { Cell } from "./cell";
import { Game } from "./game";
import { Bot } from "./bot";

@Component({
  selector: "ms-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.scss"]
})
export class GameComponent implements OnInit {
  @HostBinding("style.grid-template-rows") gridTemplateRows: SafeStyle;
  @HostBinding("style.grid-template-columns") gridTemplateColumns: SafeStyle;

  mines = 5;
  rows = 6;
  columns = 6;
  game = new Game(this.rows, this.columns, this.mines);
  constructor(private domSanitizer: DomSanitizer) {}

  ngOnInit() {
    this.newGame();
  }

  check(cell: Cell) {
    if (!cell.hidden || cell.mark) return;

    if (this.game.dig(cell)) {
      alert("lose");
    }
  }
  mark(event: Event, cell: Cell) {
    event.preventDefault();

    if (!cell.hidden) return;

    cell.mark = !cell.mark;
  }

  private newGame() {
    this.game = new Game(this.rows, this.columns, this.mines);
    this.setHostGridStyles();
  }

  private setHostGridStyles() {
    this.gridTemplateRows = this.domSanitizer.bypassSecurityTrustStyle(
      `repeat(${this.rows}, 1fr)`
    );
    this.gridTemplateColumns = this.domSanitizer.bypassSecurityTrustStyle(
      `repeat(${this.columns}, 1fr)`
    );
  }
}
