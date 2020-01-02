import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { IComment } from '../shared/model/comment';
import { CommunicateService } from '../shared/services/utils/communicate.service';
import { Subscription } from 'rxjs';
import { LoggingService } from '../shared/services/system/logging.service';
import { CommentService } from '../shared/services/comment.services';
import { AuthService } from '../shared/services/security/auth.service';
import { ToastrService } from 'ngx-toastr';
import { IItem } from '../shared/model/item';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit, OnDestroy {
  comments: IComment[];
  subscription: Subscription;
  item: IItem;
  nextPage = 0;
  perPage = 10;
  constructor(
    private _commentSvc: CommentService,
    private _commSvc: CommunicateService,
    public authSvc: AuthService,
    private _toastr: ToastrService,
    private _log: LoggingService) { }

  ngOnInit() {
    this.comments = [];
    this.subscription = this._commSvc.newComment$.subscribe((comment: IComment) => {
      if (
        comment &&
        !comment.parentCommentId &&
        (!this._commentSvc.latestComment ||
          this._commentSvc.latestComment._id != comment._id || // this is to prevent extra comment showing up after adding new comment
          this._commentSvc.edittingComment)
      ) {
        if (!this._commentSvc.edittingComment) {
          this.comments.push(comment);
        } else {
          this.comments[this._commentSvc.edittingCommentIndex] = comment;
          this._commentSvc.edittingCommentIndex = -1;
          this._commentSvc.edittingComment = null;
        }
        this._commentSvc.latestComment = comment;
      }
    });
  }

  getComments(item) {
    this.item = item;
    this.nextPage = 0;
    var params = {
      page: this.nextPage,
      perPage: this.perPage
    };
    this._commentSvc.getCommentsOfItem(this.item._id, params).subscribe((comments: IComment[]) => {
      this.comments = comments;
    });
  }

  getMoreComments() {
    this.nextPage = Math.floor(this.comments.length / this.perPage);
    var params = {
      page: this.nextPage,
      perPage: this.perPage
    };
    this._commentSvc.getCommentsOfItem(this.item._id, params).subscribe((comments: IComment[]) => {
      for (var i = 0; i < comments.length; i++) {
        this.comments[this.nextPage * this.perPage + i] = comments[i];
      }
    });
  }

  deleteComment(index: number, comment: IComment) {
    this._commentSvc.deleteComment(comment).subscribe(res => {
      this.item.noOfComments = this.item.noOfComments - (1 + this.comments[index].noOfReplies);
      this.comments.splice(index, 1);
      this._toastr.success("Comment deleted!");
    });
  }

  editComment(index: number) {
    this._commentSvc.populateDataToCommentbox(this.comments[index], index);
  }

  ngOnDestroy() {
    this._log.log("onDestroy CommentsComponent")
    this.subscription.unsubscribe();
  }
}
