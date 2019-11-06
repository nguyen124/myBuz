import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { IComment } from '../shared/model/comment';
import { CommunicateService } from '../shared/services/utils/communicate.service';
import { Subscription } from 'rxjs';
import { LoggingService } from '../shared/services/system/logging.service';
import { CommentService } from '../shared/services/comment.services';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit, OnDestroy {
  comments: IComment[];
  subscription: Subscription;
  currentPageOfComment = 0;
  itemId: string;
  perPage = 10;
  constructor(
    private _commentSvc: CommentService,
    private _commSvc: CommunicateService,
    private _log: LoggingService) { }

  ngOnInit() {
    this.subscription = this._commSvc.newComment$.subscribe((comment: IComment) => {
      if (comment && !comment.parentCommentId) {
        this.comments.push(comment);
      }
    });
  }


  getComments(id) {
    this.itemId = id;
    this.currentPageOfComment = 0;
    this._commentSvc.getCommentsOfItem(this.itemId, 0).subscribe((comments: IComment[]) => {
      this.comments = comments;
      if (this.comments.length == this.perPage) {
        this.currentPageOfComment = 1;
      }
    });
  }

  getMoreComments() {
    this._commentSvc.getCommentsOfItem(this.itemId, this.currentPageOfComment).subscribe((comments: IComment[]) => {
      for (var i = 0; i < comments.length; i++) {
        this.comments[this.currentPageOfComment * this.perPage + i] = comments[i];
      }
      if (comments.length == this.perPage) {
        this.currentPageOfComment++
      }
    });
  }

  ngOnDestroy() {
    this._log.log("onDestroy CommentsComponent")
    this.subscription.unsubscribe();
  }
}
