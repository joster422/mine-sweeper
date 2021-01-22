import { Cell } from './cell';

export class Game {
  grid: Cell[] = [];

  constructor(
    public existingGrid?: Cell[],
    public rows = 10,
    public columns = 10,
    public mines = 10
  ) {
    if (this.existingGrid !== undefined) {
      this.grid = this.existingGrid;
      return;
    }
    this.grid = [];

    for (let x = 0; x < rows; x++)
      for (let y = 0; y < columns; y++)
        this.grid.push(new Cell(x, y));

    do {
      const cell = this.grid[Math.floor(Math.random() * this.rows * this.columns)];
      if (!cell.mine) {
        cell.mine = true;
        this.getNeighbors(cell).forEach(neighbor => neighbor.score++);
      }
    }
    while (this.grid.filter(cell => cell.mine).length < mines);

    do {
      const cell = this.grid[Math.floor(Math.random() * this.rows * this.columns)];
      if (!cell.mine)
        this.check(cell);
    }
    while (this.grid.every(cell => cell.hidden));
  }

  check(cell: Cell): boolean | null {
    if (!cell.hidden)
      throw new Error('only check hidden cell');

    cell.hidden = false;

    if (cell.mine)
      return true;

    if (cell.score === 0)
      this.revealScoreZero(cell);

    if (this.grid.filter(item => item.hidden).length === this.mines)
      return null;

    return false;
  }

  private revealScoreZero(cell: Cell): void {
    const neighbors = this.getNeighbors(cell)
      .filter(neighbor => neighbor.hidden);

    neighbors.forEach(neighbor => {
      neighbor.hidden = false;
    });

    neighbors.forEach(neighbor => {
      if (neighbor.score === 0)
        this.revealScoreZero(neighbor);
    });
  }

  scan(cell: Cell): Cell[] {
    if (cell.hidden)
      throw new Error('only scan not hidden cell');

    const hiddenNeighbors = this.getNeighbors(cell)
      .filter(neighbor => neighbor.hidden);

    const hiddenMarkNeighbors = hiddenNeighbors
      .filter(neighbor => neighbor.mark);

    if (hiddenMarkNeighbors.length === cell.score)
      return hiddenNeighbors.filter(neighbor => !neighbor.mark);

    return [];
  }

  getNeighbors(target: Cell): Cell[] {
    return this.grid.filter(cell =>
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
}
