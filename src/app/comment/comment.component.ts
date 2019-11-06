import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { IComment } from '../shared/model/comment';
import { IUser } from '../shared/model/user';
import { ICommentUserLog } from '../shared/model/commentUserLog';
import { CommentService } from '../shared/services/comment.services';
import { CommunicateService } from '../shared/services/utils/communicate.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../shared/services/security/auth.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  @Input()
  comment: IComment;
  @Input()
  index: number;
  user: IUser;
  commentUserLog: ICommentUserLog;
  commentContent: string;
  subscription: Subscription;
  currentPageOfReplies = 0;
  perPage = 5;

  constructor(
    private _commentSvc: CommentService,
    private _commSvc: CommunicateService,
    public _authSvc: AuthService,
    private _toastr: ToastrService) {

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
    this.currentPageOfReplies = 0;
    this._commentSvc.getRepliesOfComment(commentId, this.currentPageOfReplies).subscribe((replies) => {
      this.comment.replies = replies;
      if (replies.length == this.perPage) {
        this.currentPageOfReplies = 1;
      }
    });
  }

  showMoreReplies(commentId: string) {
    this._commentSvc.getRepliesOfComment(commentId, this.currentPageOfReplies).subscribe((replies) => {
      for (var i = 0; i < replies.length; i++) {
        this.comment.replies[this.currentPageOfReplies * this.perPage + i] = replies[i];
      }
      if (replies.length == this.perPage) {
        this.currentPageOfReplies++;
      }
    });
  }

  deleteComment(index: number, commentId: string) {
    this._commentSvc.deleteComment(commentId).subscribe(parentComment => {
      this.comment.replies.splice(index, 1);
      this.comment.noOfReplies = parentComment.noOfReplies;
      this._toastr.success("Reply deleted!");
    });
  }

  editComment(index: number, commentId: string) {

  }

  reportComment(index: number, commentId: string) {

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
