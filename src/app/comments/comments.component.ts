import { Component, OnInit, Input } from '@angular/core';
import { IComment } from '../model/comment';
import { CommentService } from '../services/comment.services';
import { ItemService } from '../services/item.services';
import { CommunicateService } from '../services/communicate-service.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  @Input()
  itemId: string;
  comments: IComment[];
  constructor(private _itemService: ItemService, private _commService: CommunicateService) { }

  ngOnInit() {
    console.log("itemId: " + this.itemId);
    this._itemService.getCommentsOfItem(this.itemId).subscribe((comments: IComment[]) => {
      this.comments = comments;
    });
    
    this._commService.comment$.subscribe((comment: IComment) => {
      if (comment) {
        this.comments.push(comment);
      }
    });
  }

}
