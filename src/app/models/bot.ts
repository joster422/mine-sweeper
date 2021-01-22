import { Cell } from './cell';
import { Game } from './game';

export class Bot {

  constructor() { }

  async getMove(game: Game, goFast: boolean): Promise<Cell> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    for (const cell of game.grid) {
      cell.mark = false;
      cell.probability = 0;
    }
    for (const cell of game.grid) {
      if (cell.hidden || cell.score === 0)
        continue;
      const neighbors = await game.getNeighbors(cell);
      const hiddenNeighbors = neighbors.filter(neighbor => neighbor.hidden);
      const probability = cell.score / hiddenNeighbors.length;
      if (!goFast) {
        cell.isBotFocus = true;
        await new Promise(resolve => setTimeout(resolve, 500));
        cell.isBotFocus = false;
      }
      for (const hiddenNeighbor of hiddenNeighbors) {
        if (hiddenNeighbor.mark)
          continue;
        hiddenNeighbor.mark = probability === 1;
      }
    }
    for (const cell of game.grid) {
      if (cell.hidden || cell.score === 0)
        continue;
      if (!goFast) {
        cell.isBotFocus = true;
        await new Promise(resolve => setTimeout(resolve, 500));
        cell.isBotFocus = false;
      }
      const scans = await game.scan(cell);
      if (scans.length === 0)
        continue;
      return scans[Math.floor(Math.random() * scans.length)];
    }
    for (const cell of game.grid) {
      if (cell.hidden || cell.score === 0)
        continue;
      const neighbors = await game.getNeighbors(cell);
      const hiddenNeighbors = neighbors.filter(neighbor => neighbor.hidden);
      const markNeighbors = hiddenNeighbors.filter(neighbor => neighbor.mark);
      if (!goFast) {
        cell.isBotFocus = true;
        await new Promise(resolve => setTimeout(resolve, 500));
        cell.isBotFocus = false;
      }
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
    for (const cell of game.grid) {
      if (cell.hidden || cell.score === 0)
        continue;
      const neighbors = await game.getNeighbors(cell);
      const hiddenNeighbors = neighbors.filter(neighbor => neighbor.hidden);
      const markNeighbors = hiddenNeighbors.filter(neighbor => neighbor.mark);
      if (!goFast) {
        cell.isBotFocus = true;
        await new Promise(resolve => setTimeout(resolve, 500));
        cell.isBotFocus = false;
      }
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
    const hiddenSafeCells = game.grid.filter(cell => cell.hidden && !cell.mark);
    if (hiddenSafeCells.length === 0)
      throw new Error('expected guess to be defined');
    return hiddenSafeCells[Math.floor(Math.random() * hiddenSafeCells.length)];
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
