import { Component, OnInit, OnDestroy, Input, ViewChildren, QueryList, isDevMode } from '@angular/core';
import { IComment } from '../shared/model/comment';
import { CommunicateService } from '../shared/services/utils/communicate.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../shared/services/security/auth.service';
import { ToastrService } from 'ngx-toastr';
import { IItem } from '../shared/model/item';
import { CommentComponent } from '../comment/comment.component';
import { ItemService } from '../shared/services/item.services';
import { CommentService } from '../shared/services/comment.services';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../environments/environment';
import { environment as prodEnvironment } from '../../environments/environment.prod';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit, OnDestroy {
  comments: IComment[];
  subscription: Subscription;
  nextPage = 0;
  readonly PER_PAGE: number = isDevMode() ? environment.COMMENT_PER_PAGE : prodEnvironment.COMMENT_PER_PAGE;
  previousIndex = null;
  replyToUsername;
  edittingCommentIdx: number;

  @Input() item: IItem;

  @ViewChildren(CommentComponent) commentCmps: QueryList<CommentComponent>;

  constructor(
    private _itemSvc: ItemService,
    private _commentSvc: CommentService,
    private _commSvc: CommunicateService,
    public authSvc: AuthService,
    private _translate: TranslateService,
    private _toastr: ToastrService) {

  }

  ngOnInit() {
    this.comments = [];
    this.getComments(this.item);
    this.subscription = this._commSvc.newComment$.subscribe((comment: IComment) => {
      if (comment && !comment.parentCommentId) {
        this.comments.push(comment);
      }
    });
  }

  getComments(item) {
    this.item = item;
    this.nextPage = 0;
    var params = {
      page: this.nextPage,
      perPage: this.PER_PAGE
    };
    this._itemSvc.getCommentsOfItem(this.item._id, params).subscribe((comments: IComment[]) => {
      this.comments = comments;
    });
  }

  getMoreComments() {
    this.nextPage = Math.floor(this.comments.length / this.PER_PAGE);
    var params = {
      page: this.nextPage,
      perPage: this.PER_PAGE
    };
    this._itemSvc.getCommentsOfItem(this.item._id, params).subscribe((comments: IComment[]) => {
      for (var i = 0; i < comments.length; i++) {
        this.comments[this.nextPage * this.PER_PAGE + i] = comments[i];
      }
    });
  }

  deleteComment(index: number, commentId: string) {
    this._commentSvc.deleteComment(commentId).subscribe(res => {
      this.item.noOfComments = this.item.noOfComments - (1 + this.comments[index].noOfReplies);
      this.comments.splice(index, 1);
      if (this.previousIndex > index) {
        this.previousIndex--;
      }
      if (this.edittingCommentIdx > index) {
        this.edittingCommentIdx--;
      }
      this._toastr.success(this._translate.instant("comment.delete.success"));
    }, err => {
      this._toastr.error(this._translate.instant("comment.delete.error"));
    });
  }

  editComment(index: number) {
    if (this.comments[index]) {
      this.hidePreviousShowingCommentBox(index);
      this.comments[index].showCommentBox = true;
      this.comments[index].isEditting = true;
      this.edittingCommentIdx = index;
      this.replyToUsername = '';
    }
  }

  handleEditingCommentDone(newComment) {
    this.comments[this.edittingCommentIdx] = newComment;
    this.comments[this.edittingCommentIdx].isEditting = false;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  showCommentBox(index: number): void {
    this.replyToUsername = this.comments[index] ? this.comments[index].writtenBy.username : '';
    this.hidePreviousShowingCommentBox(index);
  }

  hidePreviousShowingCommentBox(index) {
    if (this.previousIndex !== undefined && this.previousIndex !== null) {
      var comment = this.comments[this.previousIndex];
      if (comment) {
        comment.showCommentBox = false;
      }
    }
    this.hideReplyCommentBox();
    if (index !== null && index !== undefined) {
      this.comments[index].showCommentBox = true;
      this.comments[index].isEditting = false;
    }
    this.previousIndex = index;
  }

  handleShowCommentBoxEvent() {
    this.hidePreviousShowingCommentBox(null);
  }

  hideReplyCommentBox() {
    this.commentCmps.forEach((el, idx) => {
      if (el) {
        el.hidePreviousReplyCommentBox(null);
      }
    });
  }
}
