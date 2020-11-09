import { Cell } from './cell/cell';

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
        this.dig(cell);
    }
    while (this.grid.every(cell => cell.hidden));
  }

  async dig(cell: Cell): Promise<boolean | undefined> {
    if (!cell.hidden)
      throw new Error('only dig hidden cell');
    cell.hidden = false;
    if (cell.mine)
      return true;
    if (cell.score === 0) {
      const neighbors = this.getNeighbors(cell);
      neighbors.forEach(neighbor => neighbor.hidden && this.dig(neighbor));
    }
    if (this.grid.filter(item => item.hidden).length === this.mines)
      return undefined;
    return false;
  }


  async scan(cell: Cell): Promise<Cell[]> {
    if (cell.hidden)
      throw new Error('can not scan hidden cell');
    const neighbors = await this.getNeighbors(cell);
    const hiddenNeighbors = neighbors.filter(neighbor => neighbor.hidden);
    if (hiddenNeighbors.filter(neighbor => neighbor.mark).length === cell.score)
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

  async getBotMove(): Promise<Cell> {
    for (const cell of this.grid) {
      cell.mark = false;
      cell.probability = 0;
    }
    for (const cell of this.grid) {
      if (cell.hidden || cell.score === 0)
        continue;
      const neighbors = await this.getNeighbors(cell);
      const hiddenNeighbors = neighbors.filter(neighbor => neighbor.hidden);
      const probability = cell.score / hiddenNeighbors.length;
      for (const hiddenNeighbor of hiddenNeighbors) {
        if (hiddenNeighbor.mark)
          continue;
        hiddenNeighbor.mark = probability === 1;
      }
    }
    for (const cell of this.grid) {
      if (cell.hidden || cell.score === 0)
        continue;
      const scans = await this.scan(cell);
      if (scans.length === 0)
        continue;
      return scans[Math.floor(Math.random() * scans.length)];
    }
    for (const cell of this.grid) {
      if (cell.hidden || cell.score === 0)
        continue;
      const neighbors = await this.getNeighbors(cell);
      const hiddenNeighbors = neighbors.filter(neighbor => neighbor.hidden);
      const markNeighbors = hiddenNeighbors.filter(neighbor => neighbor.mark);
      if (hiddenNeighbors.length === markNeighbors.length || cell.score - markNeighbors.length !== 1)
        continue;
      const safeNeighbors = hiddenNeighbors.filter(neighbor => !neighbor.mark);
      if (hiddenNeighbors.length - markNeighbors.length === cell.score - markNeighbors.length)
        return safeNeighbors[Math.floor(Math.random() * safeNeighbors.length)];
      const probability = (cell.score - markNeighbors.length) / (hiddenNeighbors.length - markNeighbors.length);
      for (const safeNeighbor of safeNeighbors) {
        if (probability <= safeNeighbor.probability)
          continue;
        safeNeighbor.probability = probability;
      }
    }
    for (const cell of this.grid) {
      if (cell.hidden || cell.score === 0)
        continue;
      const neighbors = await this.getNeighbors(cell);
      const hiddenNeighbors = neighbors.filter(neighbor => neighbor.hidden);
      const markNeighbors = hiddenNeighbors.filter(neighbor => neighbor.mark);
      if (hiddenNeighbors.length === markNeighbors.length)
        continue;
      for (const subset of this.combinations(hiddenNeighbors)) {
        const total = subset.reduce((acc, item) => acc + (item.mark ? 1 : item.probability), 0);
        if (total === cell.score) {
          const notSubsetNeighbors = hiddenNeighbors.filter(neighbor => !subset.includes(neighbor));
          return notSubsetNeighbors[Math.floor(Math.random() * notSubsetNeighbors.length)];
        }
      }
    }
    console.log('guess');
    const guess = this.grid.find(cell => cell.hidden && !cell.mark);
    if (guess === undefined)
      throw new Error('expected guess to be defined');
    return guess;
  }

  private combination(set: Cell[], n: number): Cell[][] {
    let ret;
    if (n > set.length || n <= 0)
      return [];
    if (n === set.length)
      return [set];
    ret = [];
    if (n === 1) {
      for (const item of set)
        ret.push([item]);
      return ret;
    }
    for (let i = 0; i < set.length - n + 1; i++)
      for (const tailCombination of this.combination(set.slice(i + 1), n - 1))
        ret.push([...set.slice(i, i + 1), ...tailCombination]);
    return ret;
  }

  private combinations(set: Cell[]) {
    let ret: Cell[][] = [];
    for (let i = 2; i <= set.length - 1; i++)
      ret = [...ret, ...this.combination(set, i)];
    return ret;
  }
}
