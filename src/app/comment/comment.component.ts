import { Component, OnInit, Input, Inject, Output, EventEmitter, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { IComment } from '../shared/model/comment';
import { IUser } from '../shared/model/user';
import { CommentService } from '../shared/services/comment.services';
import { CommunicateService } from '../shared/services/utils/communicate.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../shared/services/security/auth.service';
import { ToastrService } from 'ngx-toastr';
import { IItem } from '../shared/model/item';
import { CommentBoxComponent } from '../comment-box/comment-box.component';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  @Input() comment: IComment;
  @Input() index: number;
  @Input() item: IItem;

  @Output() showCommentBoxEvent: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(CommentBoxComponent, { static: false }) replyCommentBoxCmp: CommentBoxComponent;

  previousIndex: number = null;
  user: IUser;
  subscription: Subscription;
  isShowingReply = false;
  nextPage = 0;
  perPage = 5;
  showToolTip: boolean = false;
  replyToUsername: string;

  constructor(
    private _commentSvc: CommentService,
    private _commSvc: CommunicateService,
    public authSvc: AuthService,
    private _toastr: ToastrService) {

  }

  ngOnInit() {
    this.comment.replies = [];
    this.subscription = this._commSvc.newComment$.subscribe(reply => {
      if (reply && reply.parentCommentId == this.comment._id) {
        this.comment.noOfReplies++;
        this.comment.replies.push(reply);
      }
    });
  }

  showReplies(commentId: string) {
    this.nextPage = 0;
    var params = {
      page: this.nextPage,
      perPage: this.perPage
    };
    this.isShowingReply = true;
    this._commentSvc.getRepliesOfComment(commentId, params).subscribe((replies) => {
      this.comment.replies = replies;
    });
  }

  showMoreReplies(commentId: string) {
    this.nextPage = Math.floor(this.comment.replies.length / this.perPage);
    var params = {
      page: this.nextPage,
      perPage: this.perPage
    };
    this._commentSvc.getRepliesOfComment(commentId, params).subscribe((replies) => {
      for (var i = 0; i < replies.length; i++) {
        this.comment.replies[this.nextPage * this.perPage + i] = replies[i];
      }
    });
  }

  deleteComment(index: number, comment: IComment) {
    this._commentSvc.deleteComment(comment).subscribe(parentComment => {
      this.comment.replies.splice(index, 1);
      if (this.previousIndex >= index) {
        this.previousIndex--;
      }
      this.item.noOfComments--;
      this.comment.noOfReplies = parentComment.noOfReplies;
      this._toastr.success("Reply deleted!");
    });
  }

  editReply(index: number) {
    if (this.comment.replies[index]) {
      this.hideOtherCommentBox();
      this.hidePreviousReplyCommentBox(index);
      this.comment.replies[index].showCommentBox = true;
      this.comment.replies[index].isEditting = true;
      this.replyToUsername = '';
    }
  }

  showReplyCommentBox(index: number): void {
    this.replyToUsername = this.comment.replies[index] ? this.comment.replies[index].writtenBy['username'] : '';
    this.hideOtherCommentBox();
    this.hidePreviousReplyCommentBox(index);
  }

  hidePreviousReplyCommentBox(index) {
    if (this.previousIndex !== null && this.previousIndex !== undefined) {
      var comment = this.comment.replies[this.previousIndex];
      if (comment) {
        comment.showCommentBox = false;
      }
    }
    if (index !== null && index !== undefined) {
      this.comment.replies[index].showCommentBox = true;
      this.comment.replies[index].isEditting = false;
    }
    this.previousIndex = index;
  }

  hideOtherCommentBox() {
    this.showCommentBoxEvent.emit("");
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
