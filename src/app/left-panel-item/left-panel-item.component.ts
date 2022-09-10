import { Component, Input, OnInit } from '@angular/core';
import { IItem } from '../shared/model/item';

@Component({
  selector: 'app-left-panel-item',
  templateUrl: './left-panel-item.component.html',
  styleUrls: ['./left-panel-item.component.css']
})
export class LeftPanelItemComponent implements OnInit {
  @Input() item: IItem;  
  constructor() { }

  ngOnInit(): void {
  }
}
