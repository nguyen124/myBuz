import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.css']
})
export class TooltipComponent implements OnInit {

  @Input() showToolTip: boolean;
  @Input() comment: Comment;

  constructor() { }

  ngOnInit() {
  }

}
