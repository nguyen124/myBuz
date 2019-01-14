import { Component, OnInit, Input } from '@angular/core';
import { IComment } from '../model/comment';
import { CommentService } from '../services/comment.services';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  @Input()
  itemId: string;
  comments: IComment[];
  constructor(private _commentService: CommentService) { }

  ngOnInit() {
    console.log("itemId: " + this.itemId);
    this._commentService.getCommentsOfItem(this.itemId).subscribe((comments: IComment[]) => {
      this.comments = comments;
    });
  }

}
