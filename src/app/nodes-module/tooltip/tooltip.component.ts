import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-tooltip',
    templateUrl: './tooltip.component.html',
    styleUrls: ['./tooltip.component.css'],
    standalone: false
})
export class TooltipComponent implements OnInit {
  @Input() node: any;

  constructor() { }

  ngOnInit() {
  }
}
