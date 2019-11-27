import { Component, OnInit, Input } from '@angular/core';
import { IComment } from '../shared/model/comment';
import { IUser } from '../shared/model/user';
import { CommentService } from '../shared/services/comment.services';
import { CommunicateService } from '../shared/services/utils/communicate.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../shared/services/security/auth.service';
import { ToastrService } from 'ngx-toastr';
import { IItem } from '../shared/model/item';

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
  yourReplies: IComment[] = [];
  keepTrackYourReplies = {};

  user: IUser;
  subscription: Subscription;
  isShowingReply = false;
  nextPage = 0;
  perPage = 5;

  constructor(
    private _commentSvc: CommentService,
    private _commSvc: CommunicateService,
    public authSvc: AuthService,
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
          this.yourReplies.push(reply);
          this.keepTrackYourReplies[reply._id] = true;
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
    var params = {
      page: this.nextPage,
      perPage: this.perPage
    };
    this.isShowingReply = true;
    this._commentSvc.getRepliesOfComment(commentId, params).subscribe((replies) => {
      this.comment.replies = replies;
      var newYourReplies = this._commentSvc.getYourComments(this.comment.replies, this.authSvc.user._id);
      for (var rep of newYourReplies) {
        if (!this.keepTrackYourReplies[rep._id]) {
          this.yourReplies.push(rep);
          this.keepTrackYourReplies[rep._id] = true;
        }
      }
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
      var newYourReplies = this._commentSvc.getYourComments(replies, this.authSvc.user._id);
      for (var rep of newYourReplies) {
        if (!this.keepTrackYourReplies[rep._id]) {
          this.yourReplies.push(rep);
          this.keepTrackYourReplies[rep._id] = true;
        }
      }
    });
  }

  deleteComment(index: number, comment: IComment) {
    this._commentSvc.deleteComment(comment).subscribe(parentComment => {
      delete this.keepTrackYourReplies[comment._id];
      this.yourReplies.splice(index, 1);
      this.item.noOfComments--;
      this.comment.noOfReplies = parentComment.noOfReplies;
      this._toastr.success("Reply deleted!");
    });
  }

  editComment(index: number) {
    this._commentSvc.populateDataToCommentbox(this.yourReplies[index], index);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
