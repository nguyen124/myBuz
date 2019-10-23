import { Component, OnInit, Input } from '@angular/core';
import { IItem } from '../shared/model/item';
import { ItemService } from '../shared/services/item.services';
import { CommunicateService } from '../shared/services/utils/communicate.service';

@Component({
  selector: 'app-react',
  templateUrl: './react.component.html',
  styleUrls: ['./react.component.css']
})
export class ReactComponent implements OnInit {
  @Input()
  item: IItem;
  upvoted = false;
  downvoted = false;
  constructor(private _itemService: ItemService, private _commService: CommunicateService) {
  }

  ngOnInit() {
  }

  upvote(): void {
    if (!this.upvoted) {
      this._itemService.upvote(this.item._id).subscribe(newScore => {
        this.setInfo(newScore, true, false);
      });
    } else {
      this._itemService.unvote(this.item._id).subscribe(newScore => {
        this.setInfo(newScore, false, false);
      });
    }
  }

  downvote(): void {
    if (!this.downvoted) {
      this._itemService.downvote(this.item._id).subscribe(newScore => {
        this.setInfo(newScore, false, true);
      });
    } else {
      this._itemService.unvote(this.item._id).subscribe(newScore => {
        this.setInfo(newScore, false, false);
      });
    }
  }

  setInfo(newScore, upvoted, downvoted) {
    this.item.point = newScore;
    this.downvoted = downvoted;
    this.upvoted = upvoted;

  }

  showItemModal() {
    this._commService.changeItem(this.item);
  }
}
