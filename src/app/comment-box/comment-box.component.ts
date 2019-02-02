import { Component, OnInit, Input } from '@angular/core';
import { CommunicateService } from '../services/communicate-service.service';
import { ItemService } from '../services/item.services';
import { IItem } from '../model/item';
import { IComment } from '../model/comment';
import { CommentService } from '../services/comment.services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-comment-box',
  templateUrl: './comment-box.component.html',
  styleUrls: ['./comment-box.component.css']
})
export class CommentBoxComponent implements OnInit {
  @Input()
  item: IItem;
  comment: IComment;

  commentContent: string;
  commentType: string = "CommentItem";
  subscription: Subscription;
  constructor(private _itemService: ItemService, private _commentService: CommentService, private _commService: CommunicateService) {

  }

  ngOnInit() {
    this.subscription = this._commService.currentComment$.subscribe(reply => {
      if (reply) {
        this.comment = reply;
        this.commentType = "ReplyComment";
      }
    })
  }

  writeTextComment() {
    if (this.commentContent && this.commentContent.trim()) {
      if (this.commentType === "CommentItem") {
        console.log("Comment Content: " + this.commentContent);
        this._itemService.addCommentToItem(this.item._id, this.commentContent).subscribe(comment => {
          this.commentContent = ""
          this._commService.changeComment(comment);
        });
      } else if (this.commentType === "ReplyComment") {
        console.log("Comment Content: " + this.commentContent);
        if (this.comment.parentCommentId) {
          this._itemService.addCommentToItem(this.comment.parentCommentId, this.commentContent).subscribe(comment => {
            this.commentContent = ""
            this._commService.onAddNewReply(comment);
          });
        } else {
          this._commentService.addReplyToComment(this.comment._id, this.commentContent).subscribe(comment => {
            this.commentContent = "";
            this.commentType = "CommentItem";
            this._commService.onAddNewReply(comment);
          });
        }
      }
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
