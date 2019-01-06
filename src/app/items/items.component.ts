import { Component, OnInit } from '@angular/core';
import { FileUtils } from '../utils/FileUtils';
import { IItem } from '../model/item';
import { ItemService } from '../services/item.services';
import { IComment } from '../model/comment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  filterType: string;
  items: IItem[];
  selectedRadioValue: string = "all";
  showWaitingMessage = false;
  currentItem: IItem;
  replies: IComment[];
  //outline = "col-lg-3 col-md-4 col-xs-6 pb-3"
  constructor(private _router: Router, private _itemService: ItemService) {

  }

  ngOnInit() {
    this._itemService.getItems().subscribe((items) => {
      this.items = items;
    });
  }

  getFileType(item: any) {
    return FileUtils.getFileType(item.url);
  }

  getItemsCount(): number {
    return this.items.length;
  }
  getSeenItemsCount(): number {
    return 0;// this.items.filter(e => e.seen === "seen").length;
  }
  getNotSeenItemsCount(): number {
    return 0; //this.items.filter(e => e.viewed === "notSeen").length;
  }
  getGlancedItemsCount(): number {
    return 0;// this.items.filter(e => e.viewed === "glanced").length;
  }
  onRadioChanged(selectedRadioValue: string) {
    this.selectedRadioValue = selectedRadioValue;
  }
  viewItemDetails(itemToView: IItem) {
    this.currentItem = itemToView;
  }
  showReplies(commentId: String) {
    this.replies = [
      { content: "hahah too funny ", url: "../../assets/gif/giphy3.gif", modifiedDate: '12/28/2019', commmentedBy: "5c2719491777ef460f90a767", itemId: "5c2719491777ef460f90a767", replyTo: null }
    ]
  }
  upVote(itemId: String, index: number): void {
    if (localStorage.getItem('currentUser')) {
      this._itemService.upVoteItem(itemId).subscribe(item => {
        this.items[index].point = item.point;
      });
    } else {
      this._router.navigate(['/login']);
    }
  }

  downVote(itemId: String, index: number): void {
    this._itemService.downVoteItem(itemId).subscribe(item => {
      this.items[index].point = item.point;
    });
  }
}
