import { Component, OnInit, Input } from '@angular/core';
import { IComment } from '../shared/model/comment';
import { IUser } from '../shared/model/user';
import { CommentService } from '../shared/services/comment.services';
import { CommunicateService } from '../shared/services/utils/communicate.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../shared/services/security/auth.service';
import { ToastrService } from 'ngx-toastr';
import { IItem } from '../shared/model/item';
import { ReportService } from '../shared/services/report.services';
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
  @Input()
  item: IItem;

  user: IUser;
  subscription: Subscription;
  isShowingReply = false;
  nextPage = 0;
  perPage = 5;

  constructor(
    private _commentSvc: CommentService,
    private _commSvc: CommunicateService,
    public _authSvc: AuthService,
    private _toastr: ToastrService) {

  }

  ngOnInit() {
    this.comment.replies = [];

    this.subscription = this._commSvc.newComment$.subscribe(reply => {
      if (reply &&
        reply.parentCommentId == this.comment._id &&
        (!this._commentSvc.latestComment ||
          this._commentSvc.latestComment._id != reply._id ||
          this._commentSvc.edittingComment)
      ) {
        this.comment.noOfReplies++;
        if (!this._commentSvc.edittingComment) {
          this.comment.replies.push(reply);
        } else {
          this.comment.replies[this._commentSvc.edittingCommentIndex] = reply;
          this._commentSvc.edittingCommentIndex = -1;
          this._commentSvc.edittingComment = null;
        }
        this._commentSvc.latestComment = reply;
      }
    });
  }

  showReplies(commentId: string) {
    this.nextPage = 0;
    this.isShowingReply = true;
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
      this.item.noOfComments--;
      this.comment.noOfReplies = parentComment.noOfReplies;
      this._toastr.success("Reply deleted!");
    });
  }

  editComment(index: number) {
    this._commentSvc.populateDataToCommentbox(this.comment.replies[index], index);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
