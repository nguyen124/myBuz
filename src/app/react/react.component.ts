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
  upvoteClass: string;
  downvoteClass: string;
  constructor(private _itemService: ItemService, private _commService: CommunicateService) {
  }

  ngOnInit() {
  }

  upvote(): void {
    this._itemService.upvote(this.item._id).subscribe(newScore => {
      this.item.point = newScore;
      this.upvoteClass = "upvoted";
    });
  }

  downvote(): void {
    this._itemService.downvote(this.item._id).subscribe(newScore => {
      this.item.point = newScore;
      this.downvoteClass = "downvoted";
    });
  }

  showItemModal() {
    this._commService.changeItem(this.item);
  }
}
