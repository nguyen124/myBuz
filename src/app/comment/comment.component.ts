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
    
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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
