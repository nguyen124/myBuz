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
  @Input() comment: IComment;
  constructor(private _commentSvc: CommentService, @Inject(JQ_TOKEN) private $: any) {
  }

  ngOnInit() {
  }

  upvote(): void {
    if (!this.comment.hasUpvoted) {
      this._commentSvc.upvote(this.comment.itemId, this.comment._id).subscribe(newScore => {
        this.setInfo(newScore, true, false);
      });
    } else {
      this._commentSvc.unvote(this.comment.itemId, this.comment._id).subscribe(newScore => {
        this.setInfo(newScore, false, false);
      });
    }
  }

  downvote(): void {
    if (!this.comment.hasDownvoted) {
      this._commentSvc.downvote(this.comment.itemId, this.comment._id).subscribe(newScore => {
        this.setInfo(newScore, false, true);
      });
    } else {
      this._commentSvc.unvote(this.comment.itemId, this.comment._id).subscribe(newScore => {
        this.setInfo(newScore, false, false);
      });
    }
  }

  setInfo(newScore, upvoted, downvoted) {
    this.comment.noOfPoints = newScore;
    this.comment.hasDownvoted = downvoted;
    this.comment.hasUpvoted = upvoted;
  }

  setCursor = function (el) {
    var range = document.createRange();
    var sel = window.getSelection();
    range.setStart(el.children()[1], 0);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  };
}
