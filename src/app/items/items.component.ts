import { Component, OnInit, Input } from '@angular/core';
import { IItem } from '../shared/model/item';
import { ItemService } from '../shared/services/item.services';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  @Input()
  items: IItem[];
  nextPage = 0;
  perPage = 4;
  constructor(private _itemService: ItemService, private _activeRoute: ActivatedRoute) {

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
