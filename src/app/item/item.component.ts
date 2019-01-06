import { Component, OnInit, Input } from '@angular/core';
import { IItem } from '../model/item';
import { IComment } from '../model/comment';
import { Router } from '@angular/router';
import { ItemService } from '../services/item.services';
import { IUser } from '../model/user';

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
  upVotedClass: string;
  downVotedClass: string;

  constructor(private _router: Router, private _itemService: ItemService) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
  }

  showReplies(commentId: String) {
    this.replies = [
      { content: "hahah too funny ", url: "../../assets/gif/giphy3.gif", modifiedDate: '12/28/2019', commmentedBy: "5c2719491777ef460f90a767", itemId: "5c2719491777ef460f90a767", replyTo: null }
    ]
  }

  upVote(itemId: String): void {
    if (this.user) {
      this._itemService.upVoteItem(itemId).subscribe(newItem => {
        this.item.point = newItem.point;
        if (!this.upVotedClass) {
          this.upVotedClass = "voted";
        } else {
          this.upVotedClass = "";
        }
        this.downVotedClass = "";
      });
    } else {
      this._router.navigate(['/login']);
    }
  }


  downVote(itemId: String): void {
    this._itemService.downVoteItem(itemId).subscribe(newItem => {
      this.item.point = newItem.point;
    });
    if (!this.downVotedClass) {
      this.downVotedClass = "voted";
    } else {
      this.downVotedClass = "";
    }
    this.upVotedClass = "";
  }
}
