import { Component, OnInit, Input, Inject } from '@angular/core';
import { IComment } from '../shared/model/comment';
import { CommentService } from '../shared/services/comment.services';
import { CommunicateService } from '../shared/services/utils/communicate.service';
import { JQ_TOKEN } from '../shared/services/jQuery.service';

@Component({
  selector: 'app-comment-react',
  templateUrl: './comment-react.component.html',
  styleUrls: ['./comment-react.component.css']
})
export class CommentReactComponent implements OnInit {
  @Input()
  comment: IComment;
  downvoted = false;
  upvoted = false;
  isShowRepliesClicked = false;
  constructor(private _commentSvc: CommentService, private _commSvc: CommunicateService, @Inject(JQ_TOKEN) private $: any) {
  }

  ngOnInit() {
    this._commentSvc.hasVoted(this.comment._id, "IComment").subscribe(hasVoted => {
      if (hasVoted == 1) {
        this.upvoted = true;
      } else if (hasVoted == -1) {
        this.downvoted = true;
      }
    });
  }

  upvote(): void {
    if (!this.upvoted) {
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
    if (!this.downvoted) {
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
    this.comment.point = newScore;
    this.downvoted = downvoted;
    this.upvoted = upvoted;
  }

  writeTextReply(): void {
    this.$("#txtReplyBox").focus();
    this.$("#txtReplyBox").val("@" + this.comment.writtenBy["userName"] + ": ");
    this._commentSvc.parentCommentId = this.comment._id;
  }

  showReplies(commentId: string) {
    this.isShowRepliesClicked = true;
    this._commentSvc.getRepliesOfComment(commentId).subscribe((replies) => {
      this.comment.replies = replies;
    });;
  }
}
