import { Component, OnInit, Input } from '@angular/core';
import { IItem } from '../model/item';
import { IComment } from '../model/comment';
import { Router } from '@angular/router';
import { ItemService } from '../services/item.services';
import { IUser } from '../model/user';
import { IItemUserLog } from '../model/itemUserLog';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

  @Input()
  item: IItem;
  replies: IComment[];
  user: IUser;
  itemUserLog: IItemUserLog;
  upVotedClass: string;
  downVotedClass: string;
  extraUpVotePoint: number = 1;
  extraDownVotePoint: number = 1;
  constructor(private _router: Router, private _itemService: ItemService) { }

  ngOnInit() {

  }

  showReplies(commentId: String) {
    this.replies = [
      { content: "hahah too funny ", url: "../../assets/gif/giphy3.gif", modifiedDate: '12/28/2019', commmentedBy: "5c2719491777ef460f90a767", itemId: "5c2719491777ef460f90a767", replyTo: null }
    ]
  }

  showItemModal() {

  }

  // upVote(): void {
  //   if (this.user) {
  //     if (!this.upVotedClass) {
  //       this._itemService.upVoteItem(this.item._id, this.user._id).subscribe(newItem => {
  //         this.item.point = newItem.point;
  //       });
  //       this.upVotedClass = "voted";
  //     } else {
  //       this.upVotedClass = "";
  //       this._itemService.unUpVoteItem(this.item._id, this.user._id).subscribe(newItem => {
  //         this.item.point = newItem.point;
  //       });
  //     }
  //     this.downVotedClass = "";
  //   } else {
  //     this._router.navigate(['/login']);
  //   }
  // }


  // downVote(): void {
  //   if (this.user) {

  //     if (!this.downVotedClass) {
  //       this._itemService.downVoteItem(this.item._id, this.user._id).subscribe(newItem => {
  //         this.item.point = newItem.point;
  //       });
  //       this.downVotedClass = "voted";
  //     } else {
  //       this._itemService.unDownVoteItem(this.item._id, this.user._id).subscribe(newItem => {
  //         this.item.point = newItem.point;
  //       });
  //       this.downVotedClass = "";
  //     }
  //     this.upVotedClass = "";
  //   } else {
  //     this._router.navigate(['/login']);
  //   }
  // }
}
