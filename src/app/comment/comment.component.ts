import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { IComment } from '../shared/model/comment';
import { IUser } from '../shared/model/user';
import { ICommentUserLog } from '../shared/model/commentUserLog';
import { CommentService } from '../shared/services/comment.services';
import { CommunicateService } from '../shared/services/utils/communicate.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  @Input()
  comment: IComment;
  user: IUser;
  commentUserLog: ICommentUserLog;
  commentContent: string;
  subscription: Subscription;
  isShowRepliesClicked = false;
  currentPageOfReplies = 0;
  currentPageOfComments = 0
  perPage = 10;

  constructor(private _commentSvc: CommentService, private _commSvc: CommunicateService) {

  }

  ngOnInit() {
    this.subscription = this._commSvc.newComment$.subscribe(reply => {
      if (reply && reply.parentCommentId == this.comment._id) {
        this.comment.noOfReplies++;
        if (!this.comment.replies) {
          this.comment.replies = [];
        }
        this.comment.replies.push(reply);
      }
    });
  }

  showReplies(commentId: string) {
    this.isShowRepliesClicked = true;

    this._commentSvc.getRepliesOfComment(commentId, this.currentPageOfReplies).subscribe((replies) => {
      if (!this.comment.replies) {
        this.comment.replies = replies;
      } else {
        for (var i = 0; i < replies.length; i++) {
          this.comment.replies[this.currentPageOfReplies * this.perPage + i] = replies[i];
        }
      }
      if (replies.length == this.perPage) {
        this.currentPageOfReplies++
      }
    });;

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
