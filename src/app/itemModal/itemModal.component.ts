import { Component, OnInit, Input } from '@angular/core';
import { IItem } from '../model/item';
import { IComment } from '../model/comment';
import { ItemService } from '../services/item.services';
import { CommunicateService } from '../services/communicate-service.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-itemModal',
  templateUrl: './itemModal.component.html',
  styleUrls: ['./itemModal.component.css']
})
export class ItemModalComponent implements OnInit {

  item: IItem;
  subScription: Subscription;
  comments: IComment[];
  constructor(private _itemService: ItemService, private _commService: CommunicateService) { }

  ngOnInit() {
    this.subScription = this._commService.item$.subscribe(item => {
      this.item = item;
      console.log('itemModal just got updated item');
    });
    this._itemService.getItemComments("5c29af372dd29f0ca6549aaa").subscribe((comments: IComment[]) => {
      this.comments = comments;
    });
  }
  ngOnDestroy() {
    this.subScription.unsubscribe();
  }
}
