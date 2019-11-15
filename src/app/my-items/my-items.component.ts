import { Component, OnInit } from '@angular/core';
import { IItem } from '../shared/model/item';
import { UserService } from '../shared/services/user-service.service';
import { ItemService } from '../shared/services/item.services';

@Component({
  selector: 'app-my-items',
  templateUrl: './my-items.component.html',
  styleUrls: ['./my-items.component.css']
})
export class MyItemsComponent implements OnInit {
  items: IItem[];
  nextPage = 0;
  perPage = 4;

  constructor(
    private _userSvc: UserService,
    private _itemService: ItemService) {
  }

  ngOnInit() {
    this._userSvc.getMyItems(this.nextPage).subscribe((newItems: IItem[]) => {
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
