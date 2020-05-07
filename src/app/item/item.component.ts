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
  @Input() baseUrl: string;
  @Input() isShowingTag: boolean;
  @ViewChild(ReactComponent, { static: false }) reactCompChild: ReactComponent;

  constructor() { }

  ngOnInit() {

  }

  showItemModal() {
    this.reactCompChild.showItemModal();
  }
}

