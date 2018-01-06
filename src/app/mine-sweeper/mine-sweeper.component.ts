import { Component, OnInit } from '@angular/core'
import { MineSweeperService, Cell } from '../mine-sweeper.service'
import { BotService } from '../bot.service';

@Component({
  selector: 'app-mine-sweeper',
  templateUrl: './mine-sweeper.component.html',
  styleUrls: ['./mine-sweeper.component.scss']
})
export class MineSweeperComponent implements OnInit {
  losingPhrases: string[] = [
    'You clicked on a mine',
    'RIP',
    'Mine activated',
    'BOOM',
    '"My leg!!" -You'
  ]

  constructor(
    private MineSweeperService: MineSweeperService,
    private BotService: BotService
  ) { }

  ngOnInit() {
    this.MineSweeperService.start()

    this.botLoop()
      .then(function() {
        console.log('bot loop ended')
      })

    // setInterval(() => {
    //   let move = this.BotService.getMove(this.MineSweeperService.grid)
    //   this.check(move);
    // }, 5000);
  }

  async botLoop() {
    try {
      const move = await this.BotService.getMoveAsync(this.MineSweeperService.grid)
      if(move == null) {
        console.log('Bot Win')
      }

      if (this.MineSweeperService.dig(move)) {
        let losingPhrase = this.losingPhrases[Math.floor(Math.random() * this.losingPhrases.length)]
        console.error(losingPhrase)
      } else {
        this.botLoop()
      }
    }
    catch (err) {
      console.error(err)
    }
  }

  // botLoop(grid: Cell[][]) {
  //   this.BotService.getMovePromise(this.MineSweeperService.grid)
  //     // .then((move) => move == null || this.botLoop(this.MineSweeperService.grid))
  //     .then((move) => {
  //       if(this.MineSweeperService.dig(move)) {
  //         let losingPhrase = this.losingPhrases[Math.floor(Math.random() * this.losingPhrases.length)]
  //         console.error(losingPhrase)
  //         reject
  //       }
  //     })
  // }

  check(cell: Cell) {
    if (!cell.hidden || cell.mark) return

    if(this.MineSweeperService.dig(cell)) {
      let losingPhrase = this.losingPhrases[Math.floor(Math.random() * this.losingPhrases.length)]
      console.error(losingPhrase)
    }
  }

  mark($event: Event, cell: Cell) {
    $event.preventDefault()

    if (!cell.hidden) return

    cell.mark = !cell.mark
  }
}