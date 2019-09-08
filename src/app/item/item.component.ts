import { Component, OnInit, Input } from '@angular/core';
import { IItem } from '../model/item';
import { IComment } from '../model/comment';
import { Router } from '@angular/router';
import { ItemService } from '../services/item.services';
import { IUser } from '../model/user';
import { IItemUserLog } from '../model/itemUserLog';
import { CommunicateService } from '../services/communicate-service.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  @Input()
  item: IItem;
  constructor(private _commService: CommunicateService, private _authSvc: AuthService, private _itemSvc: ItemService) { }

  ngOnInit() {
    this._authSvc.loggingEventEmitter.subscribe(loggingStatus => {
      if (loggingStatus) {
        this._itemSvc.getItemInfo(this.item);
      }
    });
  }

  showItemModal() {
    this._commService.changeItem(this.item);
  }
}
