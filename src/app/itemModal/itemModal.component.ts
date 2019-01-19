import { Component, OnInit } from '@angular/core';
import { IItem } from '../model/item';
import { CommunicateService } from '../services/communicate-service.service';
import { Subscription } from 'rxjs';
import * as $ from 'jquery';
import { CommentService } from '../services/comment.services';
import { ItemService } from '../services/item.services';
@Component({
  selector: 'app-itemModal',
  templateUrl: './itemModal.component.html',
  styleUrls: ['./itemModal.component.css']
})
export class ItemModalComponent implements OnInit {

  item: IItem;
  subScription: Subscription;
  isCommentForItem: boolean;
  commentContent: string;
  constructor(private _itemService: ItemService, private _commService: CommunicateService) { }

  ngOnInit() {
    this.subScription = this._commService.item$.subscribe(item => {
      if (item) {
        this.item = item;
        this.isCommentForItem = true;
        setTimeout(() => {
          $("#txtArea").focus();
        }, 500);
      }
    });
  }

  textComment() {
    if (this.commentContent && this.commentContent.trim()) {
      if (this.isCommentForItem) {
        console.log("Comment Context: " + this.commentContent);
        this._itemService.addCommentToItem(this.item._id, this.commentContent).subscribe(comment => {
          this._commService.changeComment(comment);
          this.commentContent = ""
        });
      }
    }
  }
  ngOnDestroy() {
    this.subScription.unsubscribe();
  }
}
