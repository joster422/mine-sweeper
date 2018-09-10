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
  rows = 10;
  columns = 10;
  interval: any;
  mines = 10;
  mineSweeper = new Game(this.rows, this.columns, this.mines);
  bot = new Bot();

  containerStyles = {
    "grid-template-rows": `repeat(${this.rows}, 1fr)`,
    "grid-template-columns": `repeat(${this.columns}, 1fr)`
  };

  constructor() {}

  ngOnInit() {
    this.botLoop().then(result => {
      console.log("game over");
    });
  }

  get grid() {
    return this.mineSweeper.grid;
  }

  check(cell: Cell) {
    if (!cell.hidden || cell.mark) return;

    if (this.mineSweeper.dig(cell)) {
      alert("lose");
      this.mineSweeper = new Game(this.rows, this.columns, this.mines);
    }
  }

  mark(event: Event, cell: Cell) {
    event.preventDefault();

    if (!cell.hidden) return;

    cell.mark = !cell.mark;
  }

  async botLoop() {
    try {
      const move = await this.bot.getMove(this.mineSweeper);

      if (move === null) {
        alert("bot wins");
        return "win";
      }

      if (this.mineSweeper.dig(move)) {
        alert("lose");
        return "lose";
      }

      this.botLoop();
    } catch (err) {
      console.error(err);
    }
  }
}
