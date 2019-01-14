import { Component, OnInit, Input } from '@angular/core';
import { IComment } from '../model/comment';
import { IUser } from '../model/user';
import { Router } from '@angular/router';
import { CommentService } from '../services/comment.services';
import { CommunicateService } from '../services/communicate-service.service';
import { ICommentUserLog } from '../model/commentUserLog';

@Component({
  selector: 'app-comment-react',
  templateUrl: './comment-react.component.html',
  styleUrls: ['./comment-react.component.css']
})
export class CommentReactComponent implements OnInit {
  @Input()
  comment: IComment;
  user: IUser;
  itemUserLog: ICommentUserLog;
  constructor(private _router: Router, private _itemService: CommentService, private _commService: CommunicateService) {
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    if (this.user) {
      this._itemService.getCommentUserLog(this.comment._id, this.user._id).subscribe(itemUserLog => {
        if (itemUserLog) {
          this.itemUserLog = itemUserLog;
          if (itemUserLog.upVoted) {
            this.comment["upVotedClass"] = "voted";
            this.comment["extraDownVotePoint"] = 2;
          } else if (itemUserLog.downVoted) {
            this.comment["downVotedClass"] = "voted";
            this.comment["extraUpVotePoint"] = 2;
          } else {
            this.comment["extraUpVotePoint"] = 1;
            this.comment["extraDownVotePoint"] = 1;
          }
        }
      });
    }
  }

  upVote(): void {
    if (this.user) {
      this.comment["extraDownVotePoint"] = 2;
      if (!this.comment["upVotedClass"]) {
        this.comment.point += this.comment["extraUpVotePoint"];
        this._itemService.upVoteComment(this.comment._id, this.user._id).subscribe(res => {
          console.log(res);
        });
        this.comment["upVotedClass"] = "voted";
      } else {
        this.comment["upVotedClass"] = "";
        this.comment["extraUpVotePoint"] = 1;
        this.comment["extraDownVotePoint"] = 1;
        this.comment.point--;
        this._itemService.unUpVoteComment(this.comment._id, this.user._id).subscribe(res => {
          console.log(res);
        });
      }
      this.comment["downVotedClass"] = "";
    } else {
      this._router.navigate(['/login']);
    }
  }

  downVote(): void {
    if (this.user) {
      this.comment["extraUpVotePoint"] = 2;
      if (!this.comment["downVotedClass"]) {
        this.comment.point -= this.comment["extraDownVotePoint"];
        this._itemService.downVoteComment(this.comment._id, this.user._id).subscribe(res => {
          console.log(res);
        });
        this.comment["downVotedClass"] = "voted";
      } else {
        this.comment["extraUpVotePoint"] = 1;
        this.comment["extraDownVotePoint"] = 1;
        this.comment["downVotedClass"] = "";
        this.comment.point++;
        this._itemService.unDownVoteComment(this.comment._id, this.user._id).subscribe(res => {
          console.log(res);
        });
      }

      this.comment["upVotedClass"] = "";
    } else {
      this._router.navigate(['/login']);
    }
  }
}
