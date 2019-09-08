import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { IComment } from '../model/comment';
import { ItemService } from '../services/item.services';
import { CommunicateService } from '../services/utils/communicate.service';
import { Subscription } from 'rxjs';
import { LoggingService } from '../services/system/logging.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit, OnDestroy, OnChanges {
  @Input()
  itemId: string;
  comments: IComment[];
  subscription: Subscription;
  constructor(
    private _itemService: ItemService,
    private _commService: CommunicateService,
    private _log: LoggingService) { }

  ngOnInit() {
    this._log.log("itemId: " + this.itemId);
    this.subscription = this._commService.newComment$.subscribe((comment: IComment) => {
      if (comment) {
        this.comments.push(comment);
      }
    });
  }

  ngOnChanges() {
    this._itemService.getCommentsOfItem(this.itemId).subscribe((comments: IComment[]) => {
      this.comments = comments;
    });
  }

  ngOnDestroy() {
    this._log.log("onDestroy CommentsComponent")
    this.subscription.unsubscribe();
  }
}
