import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Cell } from './cell';

@Component({
  selector: 'ms-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent {
  @Input() cell!: Cell;
  @Input() disabled = false;

  @Output() check = new EventEmitter();
  @Output() scan = new EventEmitter();

  constructor() { }

  onCheck() {
    if (this.cell.mark) return;
    this.check.emit();
  }

  onMark(event: Event) {
    event.preventDefault();
    this.cell.mark = !this.cell.mark;
  }

  onScan(event: Event) {
    event.preventDefault();
    this.scan.emit();
  }
}
