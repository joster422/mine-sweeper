import { Injectable } from '@angular/core';

@Injectable()
export class BotService {

  constructor() { }

  public getMove(grid: Cell[][]): Cell {
    // Assign propabilties
    grid.forEach(row => row.forEach(cell => {
      // Only analyze not hidden cells, otherwise cheating
      // Only care about cells that have mines around them
      if(!cell.hidden && cell.score != 0) {
        let neighbors = this.getNeighbors(cell, grid)

        let hiddenNeighbors = neighbors.filter(neighbor => neighbor.hidden)

        // Only care if there are cells worth analyzing
        if(hiddenNeighbors.length > 0) {
          let probability = cell.score / hiddenNeighbors.length

          hiddenNeighbors.forEach((neighbor) => {
            neighbor.probability = probability > neighbor.probability ? probability : neighbor.probability
          })
        }
      }
    }))

    // Utilize propabilties
    for(let x = 0; x < grid.length; x++) {
      for(let y = 0; y < grid[x].length; y++) {
        let cell = grid[x][y]
        
        if(!cell.hidden && cell.score != 0) {
          let neighbors = this.getNeighbors(cell, grid)
  
          let hiddenNeighbors = neighbors.filter(neighbor => neighbor.hidden)
  
          if(hiddenNeighbors.length > 1) {
            let combinations = this.combinations(hiddenNeighbors)
  
            // Only care about valid cases
            combinations = combinations.filter((x) => x.length != hiddenNeighbors.length)
  
            for(let i = 0; i < combinations.length; i++) {
              let combination = combinations[i]
              let total = combination.reduce((acc, val) => acc + val.probability, 0)

              if(Math.floor(total) == cell.score) {
                // this combination contains enough mines so others are safe
                let safe = hiddenNeighbors.filter(neighbor => combination.indexOf(neighbor) == -1)
                return this.choose(safe)
              }
            }
          }
        }
      }
    }

    let hiddenCells = grid.reduce((acc, val) => acc.concat(val.filter(cell => cell.hidden)), [])
    return this.choose(hiddenCells)
  }

  private combinations(list) {
    let res = []
    for (let i = 1; i < (1 << list.length); i++) {
      let combination = []
      for (let j = 0; j < list.length; j++) {
        if (i & (1 << j)) {
          combination.push(list[j])
        }
      }
      res.push(combination)
    }
    return res;
  }

  private getNeighbors(cell: Cell, grid: Cell[][]): Cell[] {
    let ret = []
    for(let i = -1; i <= 1; i++) {
      for(let j = -1; j <= 1; j++) {
        (i != 0 || j != 0) && grid[cell.x+i] !== undefined && grid[cell.x+i][cell.y+j] !== undefined && ret.push(grid[cell.x+i][cell.y+j])
      }
    }
    return ret
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
  mark: boolean,
  probability: number
}