import { Component, OnInit } from '@angular/core';
import { IItem } from '../shared/model/item';
import { ItemService } from '../shared/services/item.services';

@Component({
  selector: 'app-my-items',
  templateUrl: './my-items.component.html',
  styleUrls: ['./my-items.component.css']
})
export class MyItemsComponent implements OnInit {
  items: IItem[];

  constructor(private _itemSvc: ItemService) {
  }

  ngOnInit() {
    this._itemSvc.getItemsOfCurrentUser().subscribe((items: IItem[]) => {
      this.items = items;
    });
  }
}
