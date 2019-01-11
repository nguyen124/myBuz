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
  upVotedClass: string;
  downVotedClass: string;
  itemUserLog: IItemUserLog;
  extraUpVotePoint: number = 1;
  extraDownVotePoint: number = 1;

  constructor(private _router: Router, private _itemService: ItemService, private _commService: CommunicateService) {
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    if (this.user) {
      this._itemService.getItemUserLog(this.item._id, this.user._id).subscribe(itemUserLog => {
        if (itemUserLog) {
          this.itemUserLog = itemUserLog;
          if (itemUserLog.upVoted) {
            this.upVotedClass = "voted";
            this.extraDownVotePoint = 2;
          } else if (itemUserLog.downVoted) {
            this.downVotedClass = "voted";
            this.extraUpVotePoint = 2;
          } else {
            this.extraUpVotePoint = 1;
            this.extraDownVotePoint = 1;
          }
        }
      });
    }
  }

  upVote(): void {
    if (this.user) {
      this.extraDownVotePoint = 2;
      if (!this.upVotedClass) {
        this.item.point += this.extraUpVotePoint;
        this._itemService.upVoteItem(this.item._id, this.user._id).subscribe(res => {
          console.log(res);
        });
        this.upVotedClass = "voted";
      } else {
        this.upVotedClass = "";
        this.extraUpVotePoint = 1;
        this.extraDownVotePoint = 1;
        this.item.point--;
        this._itemService.unUpVoteItem(this.item._id, this.user._id).subscribe(res => {
          console.log(res);
        });
      }
      this.downVotedClass = "";
    } else {
      this._router.navigate(['/login']);
    }
  }

  downVote(): void {
    if (this.user) {
      this.extraUpVotePoint = 2;
      if (!this.downVotedClass) {
        this.item.point -= this.extraDownVotePoint;
        this._itemService.downVoteItem(this.item._id, this.user._id).subscribe(res => {
          console.log(res);
        });
        this.downVotedClass = "voted";
      } else {
        this.extraUpVotePoint = 1;
        this.extraDownVotePoint = 1;
        this.downVotedClass = "";
        this.item.point++;
        this._itemService.unDownVoteItem(this.item._id, this.user._id).subscribe(res => {
          console.log(res);
        });
      }

      this.upVotedClass = "";
    } else {
      this._router.navigate(['/login']);
    }
  }

  showItemModal() {
    this._commService.changeItem(this.item);
  }
}
