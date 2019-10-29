import { Component, OnInit, Input, Inject } from '@angular/core';
import { IComment } from '../shared/model/comment';
import { CommentService } from '../shared/services/comment.services';
import { JQ_TOKEN } from '../shared/services/jQuery.service';

@Component({
  selector: 'app-comment-react',
  templateUrl: './comment-react.component.html',
  styleUrls: ['./comment-react.component.css']
})
export class CommentReactComponent implements OnInit {
  @Input()
  comment: IComment;

  constructor(private _commentSvc: CommentService, @Inject(JQ_TOKEN) private $: any) {
  }

  ngOnInit() {
  }

  upvote(): void {
    if (!this.comment.upvoted) {
      this._commentSvc.upvote(this.comment._id, "IComment").subscribe(newScore => {
        this.setInfo(newScore, true, false);
      });
    } else {
      this._commentSvc.unvote(this.comment._id, "IComment").subscribe(newScore => {
        this.setInfo(newScore, false, false);
      });
    }
  }

  downvote(): void {
    if (!this.comment.downvoted) {
      this._commentSvc.downvote(this.comment._id, "IComment").subscribe(newScore => {
        this.setInfo(newScore, false, true);
      });
    } else {
      this._commentSvc.unvote(this.comment._id, "IComment").subscribe(newScore => {
        this.setInfo(newScore, false, false);
      });
    }
  }

  setInfo(newScore, upvoted, downvoted) {
    this.comment.noOfPoints = newScore;
    this.comment.downvoted = downvoted;
    this.comment.upvoted = upvoted;
  }

  writeTextReply(): void {
    this.$("#txtReplyBox").focus();
    this.$("#txtReplyBox").val("@" + this.comment.writtenBy["username"] + ": ");
    this._commentSvc.parentCommentId = this.comment.parentCommentId || this.comment._id;
  }
}
