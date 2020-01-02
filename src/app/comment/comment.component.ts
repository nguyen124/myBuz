import { Component, OnInit, Input, Inject } from '@angular/core';
import { IComment } from '../shared/model/comment';
import { IUser } from '../shared/model/user';
import { CommentService } from '../shared/services/comment.services';
import { CommunicateService } from '../shared/services/utils/communicate.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../shared/services/security/auth.service';
import { ToastrService } from 'ngx-toastr';
import { IItem } from '../shared/model/item';
import { JQ_TOKEN } from '../shared/services/jQuery.service';

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

  tooltip: string;

  user: IUser;
  subscription: Subscription;
  isShowingReply = false;
  nextPage = 0;
  perPage = 5;

  constructor(
    private _commentSvc: CommentService,
    private _commSvc: CommunicateService,
    public authSvc: AuthService,
    private _toastr: ToastrService,
    @Inject(JQ_TOKEN) private $: any) {

  }

  ngOnInit() {
    this.comment.replies = [];
    var that = this;
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
          that.setMouseOverForReply(that)
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
    var that = this;
    this._commentSvc.getRepliesOfComment(commentId, params).subscribe((replies) => {
      this.comment.replies = replies;
      that.setMouseOverForReply(that)
    });
  }

  setMouseOverForReply(that) {
    setTimeout(() => {
      that.$('.reply-comment').on('mouseover', function (event) {
        if (event && event.currentTarget) {
          var href = event.currentTarget.getAttribute('href');
          if (href) {
            var commentId = href.split('#')[1];
            if (commentId) {
              that._commentSvc.getCommentById(commentId).subscribe(comment => {
                that.$('#my-tooltip').remove();
                that.$(`<div id="my-tooltip"></div>`).html(comment.content).appendTo(event.currentTarget.parentElement);
                // setTimeout(() => {
                //   that.$('#my-tooltip').on('mouseout', function (innerEvt) {
                //     innerEvt.currentTarget.remove();
                //   });
                // }, 0);
              });
            }
          }
        }
      });

      that.$('.reply-comment').on('mouseout', function (event) {
        that.$('#my-tooltip').remove();
      });

    }, 0);
  }

  showMoreReplies(commentId: string) {
    var that = this;
    this.nextPage = Math.floor(this.comment.replies.length / this.perPage);
    var params = {
      page: this.nextPage,
      perPage: this.perPage
    };
    this._commentSvc.getRepliesOfComment(commentId, params).subscribe((replies) => {
      for (var i = 0; i < replies.length; i++) {
        this.comment.replies[this.nextPage * this.perPage + i] = replies[i];
      }
      that.setMouseOverForReply(that);
    });
  }

  deleteComment(index: number, comment: IComment) {
    this._commentSvc.deleteComment(comment).subscribe(parentComment => {
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
