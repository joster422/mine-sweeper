export class Cell {
  score = 0;
  mine = false;
  hidden = true;
  mark = false;
  probability = 0;

  constructor(public x: number, public y: number) { }
}
