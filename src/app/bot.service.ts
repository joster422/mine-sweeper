import { Injectable } from '@angular/core';
import { Cell } from './mine-sweeper.service';

@Injectable()
export class BotService {

  constructor() { }

  timeoutLength: number = 1000;
  public getMovePromise(grid: Cell[][]): Promise<Cell> {
    return new Promise((resolve, reject) => {
      // Assign propabilties
      let assignCount = 0
      for(let x = 0; x < grid.length; x++) {
        for(let y = 0; y < grid[x].length; y++) {
          let cell = grid[x][y]
          // Analyze not hidden cells, otherwise cheating
          // Cells that have mines around them
          if(!cell.hidden && cell.score != 0) {
            let neighbors = this.getNeighbors(cell, grid)

            let hiddenNeighbors = neighbors.filter(neighbor => neighbor.hidden)

            // Only care if there are cells worth analyzing
            if(hiddenNeighbors.length > 0) {
              let probability = cell.score / hiddenNeighbors.length

              hiddenNeighbors.forEach((neighbor) => {
                neighbor.probability = probability > neighbor.probability ? probability : neighbor.probability
                neighbor.flashy = true
              })

              window.setTimeout(() => {
                hiddenNeighbors.forEach((neighbor) => {
                  neighbor.flashy = false;
                })
              }, assignCount * this.timeoutLength);
              assignCount = assignCount + 1
            }
          }
        }
      }

      // Utilize propabilties
      let utilizeCount = 0;
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

                combination.forEach((neighbor) => {
                  neighbor.flashy = true
                })
                window.setTimeout(() => {
                  combination.forEach((neighbor) => {
                    neighbor.flashy = false
                  })
                }, (assignCount + utilizeCount) * this.timeoutLength)
                utilizeCount = utilizeCount + 1

                if(Math.floor(total) == cell.score) {
                  // this combination contains enough mines so others are safe
                  let safe = hiddenNeighbors.filter(neighbor => combination.indexOf(neighbor) == -1)
                  
                  window.setTimeout(() => {
                    resolve(this.choose(safe))
                  }, (assignCount + utilizeCount) * this.timeoutLength)
                  return
                }
              }
            }
          }
        }
      }

      // Can't find a spot so choose randomly
      let hiddenCells = grid.reduce((acc, val) => acc.concat(val.filter(cell => cell.hidden)), [])
      setTimeout(() => {
        resolve(this.choose(hiddenCells))
      }, (assignCount + utilizeCount) * this.timeoutLength)
    })
  }

  public getMove(grid: Cell[][]): Cell {

    // Assign propabilties
    grid.forEach(row => row.forEach(cell => {
      // Analyze not hidden cells, otherwise cheating
      // Cells that have mines around them
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

    // Can't find a spot so choose randomly
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