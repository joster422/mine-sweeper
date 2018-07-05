import { Component, OnInit } from "@angular/core";
import { MineService, Cell } from "../mine.service";
import { SweeperService } from "../sweeper.service";

@Component({
  selector: "ms-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.scss"]
})
export class GameComponent implements OnInit {
  grid: Cell[][] = this.mineService.grid;

  constructor(
    private mineService: MineService,
    private sweeperService: SweeperService
  ) {}

  ngOnInit() {
    this.mineService.start();

    this.botLoop().then(result => {
      switch (result) {
        case "win":
          alert("bot wins");
          break;
        case "lose":
          alert("lose");
          break;
      }
    });
  }

  check(cell: Cell) {
    if (!cell.hidden || cell.mark) return;

    if (this.mineService.dig(cell)) alert("lose");
  }

  mark($event: Event, cell: Cell) {
    $event.preventDefault();

    if (!cell.hidden) return;

    cell.mark = !cell.mark;
  }

  async botLoop() {
    try {
      const move = await this.sweeperService.getMoveAsync(
        this.mineService.grid
      );

      if (move == null) return "win";

      if (this.mineService.dig(move)) return "lose";

      this.botLoop();
    } catch (err) {
      console.error(err);
    }
  }
}
