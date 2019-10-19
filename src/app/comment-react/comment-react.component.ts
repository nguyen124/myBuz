import { Component, OnInit, Input, Inject } from '@angular/core';
import { IComment } from '../shared/model/comment';
import { IUser } from '../shared/model/user';
import { CommentService } from '../shared/services/comment.services';
import { CommunicateService } from '../shared/services/utils/communicate.service';
import { ICommentUserLog } from '../shared/model/commentUserLog';
import { JQ_TOKEN } from '../shared/services/jQuery.service';

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

  constructor(private _commentService: CommentService, private _commService: CommunicateService, @Inject(JQ_TOKEN) private $: any) {
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

  writeTextReply(): void {
    this.$("#txtReplyBox").focus();
    this.$("#txtReplyBox").val("@" + this.comment.writtenBy["userName"] + ": ");
    this._commService.onClickReply(this.comment);
  }
}
