import { Component } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { from, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Cell, Form, Game, ValidatedForm } from '../models';
import { Bot } from '../models/bot';

@Component({
  selector: 'ms-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {
  game!: Game;
  bot = new Bot();
  form = new Form();
  newGameSubject = new Subject();
  botSubscription?: Subscription;
  isVictory: boolean | null = null;

  constructor(private domSanitizer: DomSanitizer) {
    this.newGame();
  }

  get gridAutoSize(): SafeStyle {
    const width = '100vw';
    const height = '100vh';
    const ret = `min(${width} / ${this.game.rows}, ${height} / ${this.game.columns})`;
    return this.domSanitizer.bypassSecurityTrustStyle(`max(${ret}, 2em)`);
  }

  get showError(): boolean {
    const hiddenCells = this.game.grid
      .filter(cell => cell.hidden);

    return this.isVictory === null
      && hiddenCells.length === this.form.mines;
  }

  async check(cell: Cell) {
    if (this.isVictory !== null)
      return;

    const wasMineChecked = this.game.check(cell);
    if (wasMineChecked === false)
      return;

    this.isVictory = wasMineChecked === null;
    await new Promise<void>(r => setTimeout(() => r(), this.isVictory ? 6000 : 3000));
    this.isVictory = null;
    this.newGame();
  }

  async scan(cell: Cell) {
    this.game.scan(cell)
      .forEach(item => item.hidden && this.check(item));
  }

  newGame(doNotCreate = false) {
    this.newGameSubject.next();
    this.newGameSubject.complete();

    if (this.botSubscription !== undefined)
      this.botSubscription.unsubscribe();

    const form = this.form as ValidatedForm;

    if (form.mines >= form.rows * form.columns - 1)
      throw new Error('invalid form');

    if (!doNotCreate)
      this.game = new Game(undefined, form.rows, form.columns, form.mines);

    if (!this.form.isBotEnabled)
      return;

    this.botSubscription = from(this.botPlay(this.game))
      .pipe(takeUntil(this.newGameSubject))
      .subscribe({
        next: async isVictory => {
          this.isVictory = isVictory;
          await new Promise<void>(r => setTimeout(() => r(), this.isVictory ? 6000 : 3000));
          this.isVictory = null
          this.newGame();
        }
      });
  }

  get percentStillHidden(): string {
    if (!this.form.columns || !this.form.rows || !this.form.mines)
      return '0';
    const hidden = this.game.grid.filter(cell => cell.hidden);
    return (100 - ((hidden.length - this.form.mines) / (this.form.rows * this.form.columns - this.form.mines) * 100)).toFixed(0);
  }

  get percentMines(): string {
    if (!this.form.columns || !this.form.rows || !this.form.mines)
      return '0';
    return (this.form.mines / (this.form.rows * this.form.columns) * 100).toFixed(0);
  }

  private async botPlay(game: Game): Promise<boolean> {
    const move = await this.bot.getMove(game, this.form.isBotFast);
    const wasMineChecked = await game.check(move);

    if (wasMineChecked === false)
      return this.botPlay(game);

    return wasMineChecked === null;
  }
}
