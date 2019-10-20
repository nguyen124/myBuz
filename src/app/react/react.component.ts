import { Component, OnInit, Input } from '@angular/core';
import { IItem } from '../shared/model/item';
import { IItemUserLog } from '../shared/model/itemUserLog';
import { IUser } from '../shared/model/user';
import { ItemService } from '../shared/services/item.services';
import { CommunicateService } from '../shared/services/utils/communicate.service';
import { AuthService } from '../shared/services/security/auth.service';

@Component({
  selector: 'app-react',
  templateUrl: './react.component.html',
  styleUrls: ['./react.component.css']
})
export class ReactComponent implements OnInit {
  @Input()
  item: IItem;
  //user: IUser;
  itemUserLog: IItemUserLog;

  constructor(private _authSvc: AuthService, private _itemService: ItemService, private _commService: CommunicateService) {
  }

  ngOnInit() {
  
    this._itemService.getItemInfo(this.item);
  }

  upVote(): void {
    this._itemService.upVote(this.item);
  }

  downVote(): void {
    this._itemService.downVote(this.item);
  }

  showItemModal() {
    this._commService.changeItem(this.item);
  }
}
