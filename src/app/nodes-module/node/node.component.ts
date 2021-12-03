import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.css']
})
export class NodeComponent implements OnInit {
  showTooltip: boolean;
  @Input() node: any;
  @Output() nodeCoorsEmitter: EventEmitter<{ top: number, left: number }> = new EventEmitter<{ top: number, left: number }>();
  @ViewChild('root', { static: false }) root: ElementRef;
  _canvasCoor: { top: number, left: number };

  @Input() set canvasCoor(value: { top: number, left: number }) {
    this._canvasCoor = value;
    if (this.root) {
      this.root.nativeElement.style.top = this.root.nativeElement.offsetTop + value.top + 'px';
      this.root.nativeElement.style.left = this.root.nativeElement.offsetLeft + value.left + 'px';
      this.node.coordinates = { top: this.root.nativeElement.offsetTop + value.top, left: this.root.nativeElement.offsetLeft + value.left };
    }
  };

  constructor() { }

  ngOnInit() {
  }

  onMoving(value: { top: number, left: number, bottom: number, right: number }) {
    this.node.coordinates = { top: value.top, left: value.left };
  }

  onMouseOver() {
    this.showTooltip = true;
  }

  onMouseOut() {
    this.showTooltip = false;
  }
}
