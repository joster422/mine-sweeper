import { Injectable } from '@angular/core';
import { Cell } from './mine-sweeper.service';

@Injectable()
export class BotService {
  timeout = 1000

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

        // we have located all mines
        // we must act quickly
        if(mineNeighbors.length && mineNeighbors.length == cell.score) {
          let safe = hiddenNeighbors.filter(neighbor => mineNeighbors.indexOf(neighbor) == -1)

          if(safe.length == 0) continue

          cell.flashy = true
          mineNeighbors.forEach(cell => cell.mark = true)
          await this.delay(this.timeout)
          mineNeighbors.forEach(cell => cell.mark = false)
          cell.flashy = false

          return this.choose(safe)
        }

        let probability = cell.score / hiddenNeighbors.length - mineNeighbors.length

        for(let i = 0; i < hiddenNeighbors.length; i++) {
          let neighbor = hiddenNeighbors[i]

          if(probability <= neighbor.probability) continue

          neighbor.probability =  probability

          cell.flashy = true
          neighbor.flashy = true
          await this.delay(this.timeout)
          neighbor.flashy = false
          cell.flashy = false
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
        combinations = combinations.filter(x => x.length != hiddenNeighbors.length)

        for(let i = 0; i < combinations.length; i++) {
          let combination = combinations[i]
          let total = combination.reduce((acc, val) => acc + val.probability, 0)

          cell.flashy = true
          combination.forEach(cell => cell.flashy = true)
          let timeout = combinations.length > 16 ? this.timeout / 7 : this.timeout
          await this.delay(timeout)
          combination.forEach(cell => cell.flashy = false)
          cell.flashy = false

          if(Math.floor(total) != cell.score) continue

          // this combination contains enough mines so others are safe
          let safe = hiddenNeighbors.filter(neighbor => combination.indexOf(neighbor) == -1)

          cell.flashy = true
          combination.forEach(cell => cell.mark = true)
          await this.delay(this.timeout)
          combination.forEach(cell => cell.mark = false)
          cell.flashy = false

          return this.choose(safe)
        }
      }
    }
    
    let guess = grid.reduce((acc, val) => acc.concat(val.filter(cell => cell.hidden && cell.probability != 1)), [])
    return this.choose(guess)
  }

  private delay(t) {
    return new Promise(r => window.setTimeout(() => r(), t))
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
    if(cells.length == 0) return null

    return cells.length == 1 ? cells[0] : cells[Math.floor(Math.random() * cells.length)]
  }
}