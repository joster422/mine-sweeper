import { Injectable } from '@angular/core';

@Injectable()
export class BotService {

  constructor() { }

  public getMove(grid: Cell[][]): Cell {
    let hiddenCells = grid.reduce((acc, val) => acc.concat(val.filter(cell => cell.hidden)), [])
    return this.choose(hiddenCells)
  }

  private choose(cells: Cell[]): Cell {
    if(cells.length == 0) {
      console.error('Bot choose')
    }
    return cells.length == 1 ? cells[0] : cells[Math.floor(Math.random() * cells.length)]
  }
}

interface Cell {
  x: number,
  y: number,
  score: number,
  mine: boolean,
  hidden: boolean,
  mark: boolean
}