import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { IItem } from '../shared/model/item';
import { ReactComponent } from '../react/react.component';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  @Input() item: IItem;
  @ViewChild(ReactComponent) reactCompChild: ReactComponent;
  modifiedDate: any;

  constructor() { }

  ngOnInit() {
    var utc = new Date(this.item.modifiedDate);
    this.modifiedDate = new Date(utc.getTime() + utc.getTimezoneOffset() * 60000);
  }

  showItemModal() {
    this.reactCompChild.showItemModal();
  }
}

