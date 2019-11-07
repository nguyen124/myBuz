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
  nextPage = 0;
  perPage = 5;

  constructor(
    private _commentSvc: CommentService,
    private _commSvc: CommunicateService,
    public _authSvc: AuthService,
    private _toastr: ToastrService) {

  }

  ngOnInit() {
    if (!this.comment.replies) {
      this.comment.replies = [];
    }
    this.subscription = this._commSvc.newComment$.subscribe(reply => {
      if (reply && reply.parentCommentId == this.comment._id) {
        this.comment.noOfReplies++;
        this.comment.replies.push(reply);
      }
    });
  }

  showReplies(commentId: string) {
    this.nextPage = 0;
    this._commentSvc.getRepliesOfComment(commentId, this.nextPage).subscribe((replies) => {
      this.comment.replies = replies;
    });
  }

  showMoreReplies(commentId: string) {
    this.nextPage = Math.floor(this.comment.replies.length / this.perPage);
    this._commentSvc.getRepliesOfComment(commentId, this.nextPage).subscribe((replies) => {
      for (var i = 0; i < replies.length; i++) {
        this.comment.replies[this.nextPage * this.perPage + i] = replies[i];
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
