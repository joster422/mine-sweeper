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

    this.botLoop(this.MineSweeperService.grid)
    console.log('The game is over!')

    // setInterval(() => {
    //   let move = this.BotService.getMove(this.MineSweeperService.grid)
    //   this.check(move);
    // }, 5000);
  }

  botLoop(grid: Cell[][]) {
    this.BotService.getMovePromise(this.MineSweeperService.grid)
      // .then((move) => move == null || this.botLoop(this.MineSweeperService.grid))
      .then((move) => {
        console.log(move)
        debugger
      })
  }

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