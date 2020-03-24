import { Component, OnInit, Input } from '@angular/core';
import { IItem } from '../shared/model/item';
import { ItemService } from '../shared/services/item.services';
import { AuthService } from '../shared/services/security/auth.service';

@Component({
  selector: 'app-my-items',
  templateUrl: './my-items.component.html',
  styleUrls: ['./my-items.component.css']
})
export class MyItemsComponent implements OnInit {
  items: IItem[];
  baseUrl: string = "/user/items";
  nextPage = 0;
  perPage = 40;

  constructor(
    private _itemService: ItemService,
    private _authSvc: AuthService) {
  }

  ngOnInit() {
    this._itemService.getItems({ page: this.nextPage, createdBy: this._authSvc.user._id }).subscribe((newItems: IItem[]) => {
      this.items = newItems;
    });
  }

  loadNext() {
    if (this.items) {
      this.nextPage = Math.floor(this.items.length / this.perPage);
    } else {
      this.nextPage = 0;
    }
    this._itemService.getItems({ page: this.nextPage, createdBy: this._authSvc.user._id }).subscribe((newItems: IItem[]) => {
      for (var i = 0; i < newItems.length; i++) {
        this.items[this.nextPage * this.perPage + i] = newItems[i];
      }
    });
  }
}
