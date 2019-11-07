import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { IComment } from '../shared/model/comment';
import { CommunicateService } from '../shared/services/utils/communicate.service';
import { Subscription } from 'rxjs';
import { LoggingService } from '../shared/services/system/logging.service';
import { CommentService } from '../shared/services/comment.services';
import { AuthService } from '../shared/services/security/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit, OnDestroy {
  comments: IComment[];
  subscription: Subscription;
  itemId: string;
  nextPage = 0;
  perPage = 10;
  constructor(
    private _commentSvc: CommentService,
    private _commSvc: CommunicateService,
    public _authSvc: AuthService,
    private _toastr: ToastrService,
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
    this.nextPage = 0;
    this._commentSvc.getCommentsOfItem(this.itemId, this.nextPage).subscribe((comments: IComment[]) => {
      this.comments = comments;
    });
  }

  getMoreComments() {
    this.nextPage = this.comments.length / this.perPage;
    this._commentSvc.getCommentsOfItem(this.itemId, this.nextPage).subscribe((comments: IComment[]) => {
      for (var i = 0; i < comments.length; i++) {
        this.comments[this.nextPage * this.perPage + i] = comments[i];
      }
    });
  }

  deleteComment(index: number, commentId: string) {
    this._commentSvc.deleteComment(commentId).subscribe(res => {
      this.comments.splice(index, 1);
      this._toastr.success("Comment deleted!");
    });
  }

  editComment(index: number, commentId: string) {

  }

  reportComment(index: number, commentId: string) {

  }

  ngOnDestroy() {
    this._log.log("onDestroy CommentsComponent")
    this.subscription.unsubscribe();
  }
}
