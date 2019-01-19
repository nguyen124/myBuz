import { Component, OnInit, Input } from '@angular/core';
import { IComment } from '../model/comment';
import { Subscription } from 'rxjs';
import { CommunicateService } from '../services/communicate-service.service';
import { IUser } from '../model/user';
import { ICommentUserLog } from '../model/commentUserLog';
import { Router } from '@angular/router';
import { CommentService } from '../services/comment.services';

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
  constructor(private _router: Router, private _commentService: CommentService, private _commService: CommunicateService) {
  }

  ngOnInit() {
    this._commentService.getCommentInfo(this.comment);
  }

  ngOnDestroy() {

  }

  upVote(): void {
    this._commentService.upVote(this.comment);
  }

  downVote(): void {
    this._commentService.downVote(this.comment);
  }

  writeReply(commentId: string) {
    $("#txtArea").focus();
    this._commentService.writeReply(commentId);
  }

  showReplies(commentId: string) {
    this.isShowRepliesClicked = true;
    this._commentService.getRepliesOfComment(commentId).subscribe((replies) => {
      this.replies = replies;
    });;
  }
}
