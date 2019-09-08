import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { IComment } from '../model/comment';
import { IUser } from '../model/user';
import { ICommentUserLog } from '../model/commentUserLog';
import { CommentService } from '../services/comment.services';
import { CommunicateService } from '../services/utils/communicate-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit, OnChanges {
  @Input()
  comment: IComment;
  user: IUser;
  commentUserLog: ICommentUserLog;
  isShowRepliesClicked: boolean = false;
  commentContent: string;
  subscription: Subscription;

  constructor(private _commentService: CommentService, private _commService: CommunicateService) {

  }

  ngOnInit() {
    this._commentService.getTotalRepliesOfComment(this.comment._id).subscribe((res) => {
      this.comment.totalReplies = res.totalReplies;
    });;
  }

  ngOnChanges(change) {
    if (!this.comment.replies) {
      this.comment.replies = [];
    }
    this.subscription = this._commService.newReply$.subscribe(reply => {
      if (reply && reply.parentCommentId == this.comment._id) {
        this.comment.totalReplies++;
        this.comment.replies.push(reply);
      }
    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  showReplies(commentId: string) {
    this.isShowRepliesClicked = true;
    this._commentService.getRepliesOfComment(commentId).subscribe((replies) => {
      this.comment.replies = replies;
    });;
  }
}
