import { Component, OnInit, Input } from '@angular/core';
import { IItem } from '../model/item';
import { IItemUserLog } from '../model/itemUserLog';
import { IUser } from '../model/user';
import { ItemService } from '../services/item.services';
import { Router } from '@angular/router';
import { CommunicateService } from '../services/communicate-service.service';

@Component({
  selector: 'app-react',
  templateUrl: './react.component.html',
  styleUrls: ['./react.component.css']
})
export class ReactComponent implements OnInit {
  @Input()
  item: IItem;
  user: IUser;
  itemUserLog: IItemUserLog;
  constructor(private _router: Router, private _itemService: ItemService, private _commService: CommunicateService) {
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    if (this.user) {
      this._itemService.getItemUserLog(this.item._id, this.user._id).subscribe(itemUserLog => {
        if (itemUserLog) {
          this.itemUserLog = itemUserLog;
          if (itemUserLog.upVoted) {
            this.item["upVotedClass"] = "voted";
            this.item["extraDownVotePoint"] = 2;
          } else if (itemUserLog.downVoted) {
            this.item["downVotedClass"] = "voted";
            this.item["extraUpVotePoint"] = 2;
          } else {
            this.item["extraUpVotePoint"] = 1;
            this.item["extraDownVotePoint"] = 1;
          }
        }
      });
    }
  }

  upVote(): void {
    if (this.user) {
      this.item["extraDownVotePoint"] = 2;
      if (!this.item["upVotedClass"]) {
        this.item.point += this.item["extraUpVotePoint"];
        this._itemService.upVoteItem(this.item._id, this.user._id).subscribe(res => {
          console.log(res);
        });
        this.item["upVotedClass"] = "voted";
      } else {
        this.item["upVotedClass"] = "";
        this.item["extraUpVotePoint"] = 1;
        this.item["extraDownVotePoint"] = 1;
        this.item.point--;
        this._itemService.unUpVoteItem(this.item._id, this.user._id).subscribe(res => {
          console.log(res);
        });
      }
      this.item["downVotedClass"] = "";
    } else {
      this._router.navigate(['/login']);
    }
  }

  downVote(): void {
    if (this.user) {
      this.item["extraUpVotePoint"] = 2;
      if (!this.item["downVotedClass"]) {
        this.item.point -= this.item["extraDownVotePoint"];
        this._itemService.downVoteItem(this.item._id, this.user._id).subscribe(res => {
          console.log(res);
        });
        this.item["downVotedClass"] = "voted";
      } else {
        this.item["extraUpVotePoint"] = 1;
        this.item["extraDownVotePoint"] = 1;
        this.item["downVotedClass"] = "";
        this.item.point++;
        this._itemService.unDownVoteItem(this.item._id, this.user._id).subscribe(res => {
          console.log(res);
        });
      }

      this.item["upVotedClass"] = "";
    } else {
      this._router.navigate(['/login']);
    }
  }

  showItemModal() {
    this._commService.changeItem(this.item);
  }
}
