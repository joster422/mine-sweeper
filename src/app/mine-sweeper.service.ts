import { Injectable } from '@angular/core';

@Injectable()
export class MineSweeperService {
  grid: Cell[][] = []
  rows: number = 10
  columns: number = 10
  mines: number = 10

  constructor() { }

  start() {
    for(let i = 0; i < this.rows; i++) {
      this.grid[i] = []
      for(let j = 0; j < this.columns; j++) {
        this.grid[i][j] = {
          x: i,
          y: j,
          score: 0,
          mine: false,
          hidden: true,
          mark: false,
          probability: 0
        }
      }
    }

    for(let i = 0; i < this.mines; i++) {
      let minePlaced = false
      while(!minePlaced) {
        let x = Math.floor(Math.random() * this.rows)
        let y = Math.floor(Math.random() * this.columns)

        if(!this.grid[x][y].mine && this.grid[x][y].hidden) {
          this.grid[x][y].mine = true
          this.getNeighbors(this.grid[x][y])
            .forEach((neighbor) => neighbor.score++)
          minePlaced = true
        }
      }
    }

    let unhideFirstTile = false;
    while(!unhideFirstTile) {
      let x = Math.floor(Math.random() * this.rows)
      let y = Math.floor(Math.random() * this.columns)

      if (!this.grid[x][y].mine) {
        this.dig(this.grid[x][y])
        unhideFirstTile = true
      }
    }
  }

  dig(cell: Cell): boolean {
    if(cell.mine) {
      return true
    }

    cell.hidden = false
    this.revealNeighborsCache = []
    cell.score == 0
      && this.revealNeighbors(cell)

    return false
  }

  revealNeighborsCache = []
  private revealNeighbors(cell: Cell): void {
    if(this.revealNeighborsCache.includes(cell)) return
    this.revealNeighborsCache.push(cell)
    this.getNeighbors(cell)
      .forEach((neighbor) => {
        neighbor.hidden = false
        neighbor.score == 0
          && this.revealNeighbors(neighbor)
      })
  }

  private getNeighbors(cell: Cell): Cell[] {
    let ret = []
    for(let i = -1; i <= 1; i++) {
      for(let j = -1; j <= 1; j++) {
        (i != 0 || j != 0) 
          && this.grid[cell.x+i] !== undefined 
          && this.grid[cell.x+i][cell.y+j] !== undefined 
          && ret.push(this.grid[cell.x+i][cell.y+j])
      }
    }
    return ret
  }
}

interface Cell {
  x: number,
  y: number,
  score: number,
  mine: boolean,
  hidden: boolean,
  mark: boolean,
  probability: number
}
