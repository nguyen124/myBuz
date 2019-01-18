import { Component, OnInit, Input } from '@angular/core';
import { IItem } from '../model/item';
import { IItemUserLog } from '../model/itemUserLog';
import { IUser } from '../model/user';
import { ItemService } from '../services/item.services';
import { Router } from '@angular/router';
import { CommunicateService } from '../services/communicate-service.service';
import { CommentService } from '../services/comment.services';

@Component({
  selector: 'app-react',
  templateUrl: './react.component.html',
  styleUrls: ['./react.component.css']
})
export class ReactComponent implements OnInit {
  @Input()
  item: IItem;
  @Input()
  hideCommment: boolean;
  user: IUser;
  itemUserLog: IItemUserLog;
  constructor(private _router: Router, private _itemService: ItemService, private _commService: CommunicateService) {
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
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
