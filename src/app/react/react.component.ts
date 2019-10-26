import { Component, OnInit, Input } from '@angular/core';
import { IItem } from '../shared/model/item';
import { CommunicateService } from '../shared/services/utils/communicate.service';
import { CommentService } from '../shared/services/comment.services';

@Component({
  selector: 'app-react',
  templateUrl: './react.component.html',
  styleUrls: ['./react.component.css']
})
export class ReactComponent implements OnInit {
  @Input()
  item: IItem;
  constructor(private _commentSvc: CommentService, private _commService: CommunicateService) {
  }

  ngOnInit() {
  }

  upvote(): void {
    if (!this.item.upvoted) {
      this._commentSvc.upvote(this.item._id, "IItem").subscribe(newScore => {
        this.setInfo(newScore, true, false);
      });
    } else {
      this._commentSvc.unvote(this.item._id, "IItem").subscribe(newScore => {
        this.setInfo(newScore, false, false);
      });
    }
  }

  downvote(): void {
    if (!this.item.downvoted) {
      this._commentSvc.downvote(this.item._id, "IItem").subscribe(newScore => {
        this.setInfo(newScore, false, true);
      });
    } else {
      this._commentSvc.unvote(this.item._id, "IItem").subscribe(newScore => {
        this.setInfo(newScore, false, false);
      });
    }
  }

  setInfo(newScore, upvoted, downvoted) {
    this.item.noOfPoints = newScore;
    this.item.downvoted = downvoted;
    this.item.upvoted = upvoted;
  }

  showItemModal() {
    this._commService.changeItem(this.item);
  }
}
