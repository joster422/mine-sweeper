import { Component, OnInit } from "@angular/core";
import { Cell } from "./cell";
import { Game } from "./game";
import { Bot } from "./bot";

@Component({
  selector: "ms-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.scss"]
})
export class GameComponent implements OnInit {
  rows = 6;
  columns = 6;
  mines = 5;
  mineSweeper = new Game(this.rows, this.columns, this.mines);
  bot = new Bot();

  containerStyles = {
    "grid-template-rows": `repeat(${this.rows}, 1fr)`,
    "grid-template-columns": `repeat(${this.columns}, 1fr)`
  };

  constructor() {}

  ngOnInit() {
    this.botLoop();
  }

  async botLoop(): Promise<any> {
    if (await this.didBotWin()) {
      console.log("bot won");
    } else {
      console.log("bot lost");
    }
    this.mineSweeper = new Game(this.rows, this.columns, this.mines);
    this.botLoop();
  }

  async didBotWin(): Promise<boolean> {
    const move = await this.bot.getMove(this.mineSweeper);
    if (move === null) {
      return true;
    }
    return this.mineSweeper.dig(move) ? false : this.didBotWin();
  }

  // user fns
  // check(cell: Cell) {
  //   if (!cell.hidden || cell.mark) return;

  //   if (this.mineSweeper.dig(cell)) {
  //     alert("lose");
  //     this.mineSweeper = new Game(this.rows, this.columns, this.mines);
  //   }
  // }
  // mark(event: Event, cell: Cell) {
  //   event.preventDefault();

  //   if (!cell.hidden) return;

  //   cell.mark = !cell.mark;
  // }
}
