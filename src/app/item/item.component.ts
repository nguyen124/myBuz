import { Component, OnInit, Input } from '@angular/core';
import { IItem } from '../model/item';
import { IComment } from '../model/comment';
import { Router } from '@angular/router';
import { ItemService } from '../services/item.services';
import { IUser } from '../model/user';
import { IItemUserLog } from '../model/itemUserLog';
import { CommunicateService } from '../services/communicate-service.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

  @Input()
  item: IItem;
  // user: IUser;
  // itemUserLog: IItemUserLog;
  // upVotedClass: string;
  // downVotedClass: string;
  // extraUpVotePoint: number = 1;
  // extraDownVotePoint: number = 1;
  //constructor(private _router: Router, private _itemService: ItemService, private _commService: CommunicateService) { }
  constructor(private _commService: CommunicateService) { }

  ngOnInit() {
  }

  showItemModal() {
    this._commService.changeItem(this.item);
  }
}
