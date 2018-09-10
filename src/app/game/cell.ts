export class Cell {
  score = 0;
  mine = false;
  hidden = true;
  mark = false;
  // for bot
  probability = 0;
  // for showing emphasis
  flashy = false;

  constructor(public x: number, public y: number) {}
}
