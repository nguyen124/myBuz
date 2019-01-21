import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { IComment } from '../model/comment';
import { IUser } from '../model/user';
import { ICommentUserLog } from '../model/commentUserLog';
import { CommentService } from '../services/comment.services';
import { CommunicateService } from '../services/communicate-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  @Input()
  comment: IComment;
  replies: IComment[];
  user: IUser;
  commentUserLog: ICommentUserLog;
  isShowRepliesClicked: boolean = false;
  commentContent: string;
  subscription: Subscription;

  constructor(private _commentService: CommentService, private _commService: CommunicateService) {
    this.subscription = this._commService.newReply$.subscribe(reply => {
      if (reply) {
        if (reply.parentCommentId == this.comment._id) {
          this.replies.push(reply);
        }
      }
    });
  }

  ngOnInit() {
    this._commentService.getCommentInfo(this.comment);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  upVote(): void {
    this._commentService.upVote(this.comment);
  }

  downVote(): void {
    this._commentService.downVote(this.comment);
  }

  writeTextReply(): void {
    $("#txtReplyBox").focus();
    $("#txtReplyBox").val("@" + this.comment.writtenBy["userName"] + ": ");
    this._commService.onClickReply(this.comment);
  }

  showReplies(commentId: string) {
    this.isShowRepliesClicked = true;
    this._commentService.getRepliesOfComment(commentId).subscribe((replies) => {
      this.replies = replies;
    });;
  }
}
