import { Cell } from "./cell/cell";

const combination = (set: Cell[], n: number): Cell[][] => {
  let i, j, combs, head, tailcombs;

  if (n > set.length || n <= 0) {
    return [];
  }

  if (n === set.length) {
    return [set];
  }

  if (n === 1) {
    combs = [];
    for (i = 0; i < set.length; i++) {
      combs.push([set[i]]);
    }
    return combs;
  }

  combs = [];
  for (i = 0; i < set.length - n + 1; i++) {
    // head is a list that includes only our current element.
    head = set.slice(i, i + 1);
    // We take smaller combinations from the subsequent elements
    tailcombs = combination(set.slice(i + 1), n - 1);
    // For each (k-1)-combination we join it with the current
    // and store it to the set of k-combinations.
    for (j = 0; j < tailcombs.length; j++) {
      combs.push(head.concat(tailcombs[j]));
    }
  }
  return combs;
}

function combinations(set: Cell[]): Cell[][] {
  let ret: Cell[][] = [];

  // Calculate all non-empty k-combinations
  for (let i = 2; i <= set.length - 1; i++) {
    ret = [...ret, ...combination(set, i)]
  }
  return ret;
}

export class Game {
  grid: Cell[] = [];

  constructor(
    public rows = 10,
    public columns = 10,
    public mines = 10
  ) {
    this.grid = [];

    for (let x = 0; x < rows; x++) {
      for (let y = 0; y < columns; y++) {
        this.grid.push(new Cell(x, y));
      }
    }

    do {
      let cell = this.grid[Math.floor(Math.random() * this.rows * this.columns)];
      if (!cell.mine) {
        cell.mine = true;
        this.getNeighbors(cell).forEach(neighbor => neighbor.score++);
      }
    }
    while (this.grid.filter(cell => cell.mine).length < mines);

    do {
      let cell = this.grid[Math.floor(Math.random() * this.rows * this.columns)];
      if (!cell.mine) {
        this.dig(cell)
      }
    }
    while (this.grid.every(cell => cell.hidden));
  }

  dig(cell: Cell): boolean | undefined {
    if (!cell.hidden) throw new Error('only dig hidden cell');
    if (cell.mine) return true;
    cell.hidden = false;
    cell.score === 0 && this.getNeighbors(cell).forEach(neighbor => neighbor.hidden && this.dig(neighbor));
    if (this.grid.filter(cell => cell.hidden).length === this.mines) return undefined;
    return false;
  }


  scan(cell: Cell): Cell[] {
    if (cell.hidden) throw new Error('can not scan hidden cell');
    const hiddenNeighbors = this.getNeighbors(cell).filter(cell => cell.hidden);
    if (hiddenNeighbors.filter(cell => cell.mark).length === cell.score) return hiddenNeighbors.filter(cell => !cell.mark);
    return [];
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

  async getBotMove(): Promise<Cell> {
    let i, j;
    for (i = 0; i < this.grid.length; i++) {
      this.grid[i].mark = false;
      this.grid[i].probability = 0;
    }
    for (i = 0; i < this.grid.length; i++) {
      let cell = this.grid[i];
      if (cell.hidden || cell.score === 0) continue;
      let hiddenNeighbors = this.getNeighbors(cell).filter(cell => cell.hidden);
      const probability = cell.score / hiddenNeighbors.length;
      for (j = 0; j < hiddenNeighbors.length; j++) {
        if (hiddenNeighbors[j].mark) continue;
        hiddenNeighbors[j].mark = probability === 1;
      }
    }
    for (i = 0; i < this.grid.length; i++) {
      const cell = this.grid[i];
      if (cell.hidden || cell.score === 0) continue;
      const scans = this.scan(cell);
      if (scans.length === 0) continue;
      return scans[Math.floor(Math.random() * scans.length)];
    }
    for (i = 0; i < this.grid.length; i++) {
      const cell = this.grid[i];
      if (cell.hidden || cell.score === 0) continue;
      const hiddenNeighbors = this.getNeighbors(cell).filter(cell => cell.hidden);
      const markNeighbors = hiddenNeighbors.filter(cell => cell.mark);
      if (hiddenNeighbors.length === markNeighbors.length || cell.score - markNeighbors.length !== 1) continue;
      const unmarkNeighbors = hiddenNeighbors.filter(cell => !cell.mark);
      if (hiddenNeighbors.length - markNeighbors.length === cell.score - markNeighbors.length) {
        // await new Promise(resolve => setTimeout(resolve, 1000))
        // debugger
        return unmarkNeighbors[Math.floor(Math.random() * unmarkNeighbors.length)];
      }
      const probability = (cell.score - markNeighbors.length) / (hiddenNeighbors.length - markNeighbors.length);
      for (j = 0; j < unmarkNeighbors.length; j++) {
        if (probability <= unmarkNeighbors[j].probability) continue;
        unmarkNeighbors[j].probability = probability;
      }
    }
    for (i = 0; i < this.grid.length; i++) {
      let cell = this.grid[i];
      if (cell.hidden || cell.score === 0) continue;
      const hiddenNeighbors = this.getNeighbors(cell).filter(neighbor => neighbor.hidden);
      const markNeighbors = hiddenNeighbors.filter(cell => cell.mark);
      if (hiddenNeighbors.length === markNeighbors.length) continue;
      let allSubsets = combinations(hiddenNeighbors);
      for (j = 0; j < allSubsets.length; j++) {
        let subset = allSubsets[j];
        let total = subset.reduce((acc, cell) => acc + (cell.mark ? 1 : cell.probability), 0);
        let notSubsetNeighbors = hiddenNeighbors.filter(neighbor => !subset.includes(neighbor));
        if (total === cell.score) {
          // await new Promise(resolve => setTimeout(resolve, 1000))
          // debugger
          return notSubsetNeighbors[Math.floor(Math.random() * notSubsetNeighbors.length)];
        }
      }
    }
    console.log('guess');
    return this.grid.find(cell => cell.hidden && !cell.mark)!;
  }
}

// const markNeighbors = hiddenNeighbors.filter(cell => cell.mark)