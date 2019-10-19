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
