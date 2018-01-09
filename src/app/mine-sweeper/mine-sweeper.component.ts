import { Component, OnInit } from '@angular/core'
import { MineSweeperService, Cell } from '../mine-sweeper.service'
import { BotService } from '../bot.service'
import { PercentPipe } from '@angular/common'

@Component({
  selector: 'app-mine-sweeper',
  templateUrl: './mine-sweeper.component.html',
  styleUrls: ['./mine-sweeper.component.scss']
})
export class MineSweeperComponent implements OnInit {
  constructor(
    private MineSweeperService: MineSweeperService,
    private BotService: BotService
  ) { }

  ngOnInit() {
    this.MineSweeperService.start()

    this.botLoop()
      .then(result => {
        switch(result) {
          case 'win':
            alert('bot wins')
            break
          case 'lose':
            alert('lose')
            break
        }
      })
  }

  async botLoop() {
    try {
      const move = await this.BotService.getMoveAsync(this.MineSweeperService.grid)

      if(move == null) return 'win'

      if(this.MineSweeperService.dig(move)) return 'lose'
      
      this.botLoop()
    }
    catch (err) {
      console.error(err)
    }
  }

  check(cell: Cell) {
    if(!cell.hidden || cell.mark) return

    if(this.MineSweeperService.dig(cell)) alert('lose')
  }

  mark($event: Event, cell: Cell) {
    $event.preventDefault()

    if (!cell.hidden) return

    cell.mark = !cell.mark
  }
}