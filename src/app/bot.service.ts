import { Injectable } from '@angular/core';
import { Cell } from './mine-sweeper.service';

@Injectable()
export class BotService {
  timeout = 300

  constructor() { }

  async getMoveAsync(grid: Cell[][]) {
    // Assign propabilties
    for(let x = 0; x < grid.length; x++) {
      for(let y = 0; y < grid[x].length; y++) {
        let cell = grid[x][y]

        if(cell.hidden || cell.score == 0) continue

        let neighbors = this.getNeighbors(cell, grid)

        let hiddenNeighbors = neighbors.filter(neighbor => neighbor.hidden)

        if(hiddenNeighbors.length == 0) continue

        let mineNeighbors = hiddenNeighbors.filter(neighbor => neighbor.probability == 1)

        if(mineNeighbors.length == cell.score) {
          let safe = hiddenNeighbors.filter(neighbor => mineNeighbors.indexOf(neighbor) == -1)
          return this.choose(safe)
        }

        let probability = cell.score / hiddenNeighbors.length

        for(let i = 0; i < hiddenNeighbors.length; i++) {
          let neighbor = hiddenNeighbors[i]

          if(probability <= neighbor.probability) continue 

          neighbor.probability =  probability

          neighbor.flashy = true
          await this.delay(this.timeout)
          neighbor.flashy = false
        }
      }
    }
    // Utilize propabilties
    for(let x = 0; x < grid.length; x++) {
      for(let y = 0; y < grid[x].length; y++) {
        let cell = grid[x][y]

        if(cell.hidden || cell.score == 0) continue
        
        let neighbors = this.getNeighbors(cell, grid)
        let hiddenNeighbors = neighbors.filter(neighbor => neighbor.hidden)

        if(hiddenNeighbors.length == 0) continue
        
        let combinations = this.combinations(hiddenNeighbors)

        // Only care about valid cases
        combinations = combinations.filter((x) => x.length != hiddenNeighbors.length)

        for(let i = 0; i < combinations.length; i++) {
          let combination = combinations[i]
          let total = combination.reduce((acc, val) => acc + val.probability, 0)

          combination.forEach((cell) => cell.flashy = true)
          await this.delay(this.timeout)
          combination.forEach((cell) => cell.flashy = false)

          if(Math.floor(total) != cell.score) continue

          // this combination contains enough mines so others are safe
          let safe = hiddenNeighbors.filter(neighbor => combination.indexOf(neighbor) == -1)
          return this.choose(safe)
        }
      }
    }
    // Can't find a spot so choose randomly
    console.log('Cant find a spot')
    let hiddenCells = grid.reduce((acc, val) => acc.concat(val.filter(cell => cell.hidden)), [])
    return this.choose(hiddenCells)
  }

  private delay(t) {
    return new Promise(r => window.setTimeout(() => r(), t))
  }

  public getMove(grid: Cell[][]): Cell {
    // Assign propabilties
    for(let x = 0; x < grid.length; x++) {
      for(let y = 0; y < grid[x].length; y++) {
        let cell = grid[x][y]

        if(cell.hidden || cell.score == 0) continue

        let neighbors = this.getNeighbors(cell, grid)
        let hiddenNeighbors = neighbors.filter(neighbor => neighbor.hidden)

        if(hiddenNeighbors.length == 0) continue

        let probability = cell.score / hiddenNeighbors.length

        for(let i = 0; i < hiddenNeighbors.length; i++) {
          let neighbor = hiddenNeighbors[i]

          neighbor.probability = probability > neighbor.probability ? probability : neighbor.probability
        }
      }
    }
    // Utilize propabilties
    for(let x = 0; x < grid.length; x++) {
      for(let y = 0; y < grid[x].length; y++) {
        let cell = grid[x][y]

        if(cell.hidden || cell.score == 0) continue
        
        let neighbors = this.getNeighbors(cell, grid)
        let hiddenNeighbors = neighbors.filter(neighbor => neighbor.hidden)

        if(hiddenNeighbors.length == 0) continue

        let mineNeighbors = hiddenNeighbors.filter(neighbor => neighbor.probability == 1)

        if(mineNeighbors.length == cell.score) {
          let safe = hiddenNeighbors.filter(neighbor => mineNeighbors.indexOf(neighbor) == -1)
          return this.choose(safe)
        }
        
        let combinations = this.combinations(hiddenNeighbors).filter((x) => x.length != hiddenNeighbors.length)

        for(let i = 0; i < combinations.length; i++) {
          let combination = combinations[i]
          let total = combination.reduce((acc, val) => acc + val.probability, 0)

          if(Math.floor(total) != cell.score) continue

          // this combination contains enough mines so others are safe
          let safe = hiddenNeighbors.filter(neighbor => combination.indexOf(neighbor) == -1)
          return this.choose(safe)
        }
      }
    }
    // Can't find a spot so choose randomly
    let hiddenCells = grid.reduce((acc, val) => acc.concat(val.filter(cell => cell.hidden)), [])
    return this.choose(hiddenCells)
  }

  private combinations(list) {
    let ret = []
    for (let i = 1; i < (1 << list.length); i++) {
      let combination = []
      for (let j = 0; j < list.length; j++) {
        if (i & (1 << j)) {
          combination.push(list[j])
        }
      }
      ret.push(combination)
    }
    return ret;
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
      return null
    }
    return cells.length == 1 ? cells[0] : cells[Math.floor(Math.random() * cells.length)]
  }
}