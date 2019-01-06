import { Component, OnInit, Input } from '@angular/core';
import { IItem } from '../model/item';
import { IComment } from '../model/comment';
import { ItemService } from '../services/item.services';
@Component({
  selector: 'app-itemModal',
  templateUrl: './itemModal.component.html',
  styleUrls: ['./itemModal.component.css']
})
export class ItemModalComponent implements OnInit {
  @Input()
  item: IItem;
  comments: IComment[];
  constructor(private _itemService: ItemService) { }

  ngOnInit() {
    this._itemService.getItemComments("5c29af372dd29f0ca6549aaa").subscribe((comments: IComment[]) => {
      this.comments = comments;
    });
  }

}
