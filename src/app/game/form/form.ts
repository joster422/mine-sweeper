export class Form {
  rows: number | null = 10;
  columns: number | null = 10;
  mines: number | null = 100 / 5;
  isBotEnabled = false;
  botSpeed: 1 | 2 | 3 = 2;
}

interface ValidatedForm {
  rows: number;
  columns: number;
  mines: number;
  isBotEnabled: boolean;
  botSpeed: 1 | 2 | 3;
}
