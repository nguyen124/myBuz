import { Component, OnInit } from '@angular/core';
import { ItemService } from '../shared/services/item.services';
import { IItem } from '../shared/model/item';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  items: IItem[];
  nextPage = 0;
  perPage = 4;

  constructor(private _itemService: ItemService) {
  }

  ngOnInit() {
    this._itemService.getItems({ page: this.nextPage }).subscribe((newItems: IItem[]) => {
      this.items = newItems;
    });
  }

  loadNext() {
    this.nextPage = Math.floor(this.items.length / this.perPage);
    this._itemService.getItems({ page: this.nextPage }).subscribe((newItems: IItem[]) => {
      for (var i = 0; i < newItems.length; i++) {
        this.items[this.nextPage * this.perPage + i] = newItems[i];
      }
    });
  }
}
