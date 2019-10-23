import { Component, OnInit } from '@angular/core';
import { IItem } from '../shared/model/item';
import { ItemService } from '../shared/services/item.services';
import { IUser } from '../shared/model/user';
import { AuthService } from '../shared/services/security/auth.service';

@Component({
  selector: 'app-my-items',
  templateUrl: './my-items.component.html',
  styleUrls: ['./my-items.component.css']
})
export class MyItemsComponent implements OnInit {
  items: IItem[];

  constructor(private _itemSvc: ItemService, private _authSvc: AuthService) {
  }

  ngOnInit() {
    this._itemSvc.getItemsOfCurrentUser().subscribe(
      (items) => {
        this.items = items;
      });
  }
}
