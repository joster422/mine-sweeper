export class Cell {
  score = 0;
  mine = false;
  hidden = true;
  mark = false;
  probability = 0;

  constructor(
    public readonly x: number,
    public readonly y: number
  ) { }
}
