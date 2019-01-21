import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IComment } from '../model/comment';
import { IUser } from '../model/user';
import { CommentService } from '../services/comment.services';
import { CommunicateService } from '../services/communicate-service.service';
import { ICommentUserLog } from '../model/commentUserLog';

@Component({
  selector: 'app-comment-react',
  templateUrl: './comment-react.component.html',
  styleUrls: ['./comment-react.component.css']
})
export class CommentReactComponent implements OnInit {
  @Input()
  comment: IComment;

  user: IUser;
  commentUserLog: ICommentUserLog;

  constructor(private _commentService: CommentService, private _commService: CommunicateService) {
  }

  ngOnInit() {    
    this._commentService.getCommentInfo(this.comment);
  }

  upVote(): void {
    this._commentService.upVote(this.comment);
  }

  downVote(): void {
    this._commentService.downVote(this.comment);
  }

  writeTextReply() {
    $("#txtReplyBox").focus();
    this._commService.onClickReply(this.comment);
  }
}
