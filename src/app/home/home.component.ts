import { Component, OnInit, ViewChild } from '@angular/core';
import { ItemService } from '../shared/services/item.services';
import { IItem } from '../shared/model/item';
import { ItemsComponent } from '../items/items.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  items: IItem[];
  nextPage = 0;
  perPage = 4;

  @ViewChild(ItemsComponent, { static: false }) itemsComponent: ItemsComponent

  constructor(private _itemService: ItemService) {
  }

  ngOnInit() {
    this.getCold();
  }

  getHot() {
    this._itemService.getItems({ page: this.nextPage, temp: "hot" }).subscribe((newItems: IItem[]) => {
      this.items = newItems;
    });
  }

  getWarm() {
    this._itemService.getItems({ page: this.nextPage, temp: "warm" }).subscribe((newItems: IItem[]) => {
      this.items = newItems;
    });
  }

  getCold() {
    this._itemService.getItems({ page: this.nextPage, temp: "cold" }).subscribe((newItems: IItem[]) => {
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
