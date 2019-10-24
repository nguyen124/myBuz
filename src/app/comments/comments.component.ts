import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { IComment } from '../shared/model/comment';
import { ItemService } from '../shared/services/item.services';
import { CommunicateService } from '../shared/services/utils/communicate.service';
import { Subscription } from 'rxjs';
import { LoggingService } from '../shared/services/system/logging.service';

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
    private _commSvc: CommunicateService,
    private _log: LoggingService) { }

  ngOnInit() {
    this.subscription = this._commSvc.newComment$.subscribe((comment: IComment) => {
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
