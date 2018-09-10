import { Cell } from "./cell";

export class Game {
  grid: Cell[] = [];

  constructor(
    public rows: number,
    public columns: number,
    public mines: number
  ) {
    this.grid = [];
    for (let x = 0; x < this.rows; x++) {
      for (let y = 0; y < this.columns; y++) {
        this.grid.push(new Cell(x, y));
      }
    }

    // place all the mines
    for (let i = 0; i < this.mines; i++) {
      let cell = this.getSafeCell();
      cell.mine = true;
      this.getNeighbors(cell).forEach(neighbor => neighbor.score++);
    }

    // dig here so that the user cannot lose on first dig
    let cell = this.getSafeCell();
    this.dig(cell);
  }

  // dig is check for mine
  dig(cell: Cell): boolean {
    // todo remove
    cell.hidden = false;

    if (cell.score === 0) {
      this.getNeighbors(cell).forEach(
        neighbor => neighbor.hidden && this.dig(neighbor)
      );
    }
    return cell.mine;
  }

  getNeighbors(target: Cell): Cell[] {
    return this.grid.filter(
      (cell: Cell) =>
        (cell.x === target.x - 1 && cell.y === target.y) ||
        (cell.x === target.x && cell.y === target.y - 1) ||
        (cell.x === target.x - 1 && cell.y === target.y - 1) ||
        (cell.x === target.x + 1 && cell.y === target.y) ||
        (cell.x === target.x && cell.y === target.y + 1) ||
        (cell.x === target.x + 1 && cell.y === target.y + 1) ||
        (cell.x === target.x + 1 && cell.y === target.y - 1) ||
        (cell.x === target.x - 1 && cell.y === target.y + 1)
    );
  }

  private getSafeCell() {
    let x = Math.floor(Math.random() * this.rows);
    let y = Math.floor(Math.random() * this.columns);
    let cell = this.grid.find(cell => cell.x === x && cell.y === y);
    return !cell.mine ? cell : this.getSafeCell();
  }
}
