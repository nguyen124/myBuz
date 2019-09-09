import { Component, OnInit } from '@angular/core';
import { IItem } from '../model/item';
import { ItemService } from '../services/item.services';
import { IUser } from '../model/user';
import { AuthService } from '../services/security/auth.service';

@Component({
  selector: 'app-my-items',
  templateUrl: './my-items.component.html',
  styleUrls: ['./my-items.component.css']
})
export class MyItemsComponent implements OnInit {
  items: IItem[];
  currentUser: IUser = undefined;

  constructor(private _itemSvc: ItemService, private _authSvc: AuthService) {

  }

  ngOnInit() {
    this.currentUser = this._authSvc.currentUser;

    this._itemSvc.getItemsOfUser(this.currentUser.userName).subscribe(
      (items) => {
        this.items = items;
      });
  }

}
