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

  constructor(private _userSvc: UserService, private _itemSvc: ItemService) {
  }

  ngOnInit() {
    this._userSvc.getMyItems().subscribe((items: IItem[]) => {
      this.items = items;
    });
  }

  deleteItem(index: number, id: string) {
    this._itemSvc.deleteItem(id).subscribe(res => {
      this.items.splice(index, 1);
    }, err => {

    });
  }
}
