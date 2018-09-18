import { Cell } from "./cell";
import { Game } from "./game";

export class Bot {
  timeout = 1000;
  constructor() {}

  async getMove(game: Game): Promise<Cell | null> {
    for (let i = 0; i < game.grid.length; i++) {
      let cell = game.grid[i];

      if (cell.hidden || cell.score === 0) continue;

      let hiddenNeighbors = game
        .getNeighbors(cell)
        .filter(neighbor => neighbor.hidden);

      if (hiddenNeighbors.length === 0) continue;

      let probability = cell.score / hiddenNeighbors.length;
      // assign probabilities
      for (let j = 0; j < hiddenNeighbors.length; j++) {
        let neighbor = hiddenNeighbors[j];

        if (probability <= neighbor.probability) continue;

        neighbor.probability = probability;

        cell.flashy = true;
        neighbor.flashy = true;
        await this.delay(this.timeout);
        neighbor.flashy = false;
        cell.flashy = false;
      }

      let mineNeighbors = hiddenNeighbors.filter(
        neighbor => neighbor.probability === 1
      );

      // located all mines
      if (mineNeighbors.length && mineNeighbors.length === cell.score) {
        let safeNeighbors = hiddenNeighbors.filter(
          neighbor => !mineNeighbors.includes(neighbor)
        );

        if (safeNeighbors.length === 0) continue;

        cell.flashy = true;
        mineNeighbors.forEach(cell => (cell.mark = true));
        await this.delay(this.timeout);
        mineNeighbors.forEach(cell => (cell.mark = false));
        cell.flashy = false;

        return this.choose(safeNeighbors);
      }
    }

    for (let i = 0; i < game.grid.length; i++) {
      let cell = game.grid[i];

      if (cell.hidden || cell.score === 0) continue;

      cell.flashy = true;
      await this.delay(this.timeout / 3);
      cell.flashy = false;

      let hiddenNeighbors = game
        .getNeighbors(cell)
        .filter(neighbor => neighbor.hidden);

      if (hiddenNeighbors.length === 0) continue;

      let allSubsets = this.getAllSubsets(hiddenNeighbors);

      for (let i = 0; i < allSubsets.length; i++) {
        let subset = allSubsets[i];
        let total = subset.reduce((acc, cell) => acc + cell.probability, 0);

        cell.flashy = true;
        subset.forEach(cell => (cell.flashy = true));
        let timeout = allSubsets.length > 16 ? this.timeout / 7 : this.timeout;
        await this.delay(timeout);
        subset.forEach(cell => (cell.flashy = false));
        cell.flashy = false;

        if (Math.floor(total) !== cell.score) continue;

        // this subset contains enough mines so others are safe
        let safeNeighbors = hiddenNeighbors.filter(
          neighbor => !subset.includes(neighbor)
        );

        cell.flashy = true;
        subset.forEach(cell => (cell.mark = true));
        await this.delay(this.timeout);
        subset.forEach(cell => (cell.mark = false));
        cell.flashy = false;

        return this.choose(safeNeighbors);
      }
    }

    // choose from all hidden cells that we know are not a mine
    return this.choose(
      game.grid.filter(cell => cell.hidden && cell.probability !== 1)
    );
  }

  // experimental promise - checking for readability
  // getMovePromise(game: Game): Promise<Cell> {
  //   return new Promise((resolve, reject) => {
  //     game.grid.filter(cell => cell.hidden && cell.score > 0).forEach(cell => {
  //       let hiddenNeighbors = game
  //         .getNeighbors(cell)
  //         .filter(neighbor => neighbor.hidden);

  //       let probability = cell.score / hiddenNeighbors.length;
  //       // assign probabilities
  //       hiddenNeighbors.forEach(neighbor => {
  //         neighbor.probability =
  //           probability > neighbor.probability
  //             ? probability
  //             : neighbor.probability;
  //       });

  //       let mineNeighbors = hiddenNeighbors.filter(
  //         neighbor => neighbor.probability === 1
  //       );

  //       // located all mines
  //       if (
  //         mineNeighbors.length === cell.score &&
  //         mineNeighbors.length !== hiddenNeighbors.length
  //       ) {
  //         let safeNeighbors = hiddenNeighbors.filter(
  //           neighbor => !mineNeighbors.includes(neighbor)
  //         );

  //         resolve(this.choose(safeNeighbors));
  //       }
  //     });
  //     game.grid.filter(cell => cell.hidden && cell.score > 0).forEach(cell => {
  //       let hiddenNeighbors = game
  //         .getNeighbors(cell)
  //         .filter(neighbor => neighbor.hidden);

  //       let allSubsets = this.getAllSubsets(hiddenNeighbors);

  //       for (let i = 0; i < allSubsets.length; i++) {
  //         let subset = allSubsets[i];
  //         let total = subset.reduce((acc, cell) => acc + cell.probability, 0);

  //         if (Math.floor(total) !== cell.score) continue;

  //         // this subset contains enough mines so others are safe
  //         let safeNeighbors = hiddenNeighbors.filter(
  //           neighbor => !subset.includes(neighbor)
  //         );

  //         return this.choose(safeNeighbors);
  //       }
  //     });
  //   });
  // }

  private choose(cells: Cell[]): Cell | null {
    return cells.length === 0
      ? null
      : cells[Math.floor(Math.random() * cells.length)];
  }

  private delay(ms: number) {
    return new Promise(r => setTimeout(r, ms));
  }

  private getAllSubsets(array: Cell[]): Cell[][] {
    return array
      .reduce(
        (subsets, value) => subsets.concat(subsets.map(set => [value, ...set])),
        [[]]
      )
      .filter(value => value.length !== array.length && value.length !== 0);
  }
}
