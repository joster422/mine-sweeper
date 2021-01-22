export class Cell {
  score = 0;
  mine = false;
  hidden = true;
  mark = false;
  probability = 0;
  isBotFocus = false;
  isBotInvestigate = false;

  constructor(
    public readonly x: number,
    public readonly y: number
  ) { }
}

