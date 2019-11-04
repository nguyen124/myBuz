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
export class CommentComponent implements OnInit, OnChanges {
  @Input()
  comment: IComment;
  user: IUser;
  commentUserLog: ICommentUserLog;
  commentContent: string;
  subscription: Subscription;
  isShowRepliesClicked = false;

  constructor(private _commentSvc: CommentService, private _commSvc: CommunicateService) {

  }

  ngOnInit() {

  }

  ngOnChanges(change) {
    if (!this.comment.replies) {
      this.comment.replies = [];
    }
    this.subscription = this._commSvc.newComment$.subscribe(reply => {
      if (reply && reply.parentCommentId == this.comment._id) {
        this.comment.totalReplies++;
        this.comment.replies.push(reply);
      }
    });
  }

  showReplies(commentId: string) {
    this.isShowRepliesClicked = true;
    this._commentSvc.getRepliesOfComment(commentId).subscribe((replies) => {
      this.comment.replies = replies;
    });;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
