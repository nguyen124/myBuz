import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IItem } from '../shared/model/item';
import { CommentService } from '../shared/services/comment.services';
import { AuthService } from '../shared/services/security/auth.service';
import { ReportService } from '../shared/services/report.services';
import { ToastrService } from 'ngx-toastr';
import { SystemService } from '../shared/services/utils/system.service';


@Component({
  selector: 'app-react',
  templateUrl: './react.component.html',
  styleUrls: ['./react.component.css']
})
export class ReactComponent implements OnInit {
  @Input()
  item: IItem;
  shareUrl: String;
  options = [];
  @Input() showModalEvent: EventEmitter<any>;

  get selectedOptions() {
    return this.options
      .filter(opt => opt.checked)
      .map(opt => opt.value)
  }

  constructor(
    private _commentSvc: CommentService,
    private _reportSvc: ReportService,
    private _toastr: ToastrService,
    private _systemSvc: SystemService,
    public authSvc: AuthService) {
  }

  ngOnInit() {
    this.options = this._systemSvc.getReasons();
    this.buildShareUrl();
  }

  buildShareUrl() {
    this.shareUrl = 'https://me2meme.com/svc/metatags?id=' + this.item._id;
  }

  upvote(): void {
    if (!this.item.hasUpvoted) {
      this.item.hasUpvoted = true;
      if (this.item.hasDownvoted) {
        this.item.noOfPoints += 2;
        this.item.hasDownvoted = false;
      } else {
        this.item.noOfPoints++;
      }
      this._commentSvc.upvote(this.item._id).subscribe(newScore => {
        //this.setInfo(newScore, true, false);
      });
    } else {
      this.item.hasUpvoted = false;
      this.item.noOfPoints--;
      this._commentSvc.unvote(this.item._id).subscribe(newScore => {
        //this.setInfo(newScore, false, false);
      });
    }
  }

  downvote(): void {
    if (!this.item.hasDownvoted) {
      this.item.hasDownvoted = true;
      if (this.item.hasUpvoted) {
        this.item.noOfPoints -= 2;
        this.item.hasUpvoted = false;
      } else {
        this.item.noOfPoints--;
      }
      this._commentSvc.downvote(this.item._id).subscribe(newScore => {
        //this.setInfo(newScore, false, true);
      });
    } else {
      this.item.noOfPoints++;
      this.item.hasDownvoted = false;
      this._commentSvc.unvote(this.item._id).subscribe(newScore => {
        //this.setInfo(newScore, false, false);
      });
    }
  }

  // setInfo(newScore, upvoted, downvoted) {
  //   this.item.noOfPoints = newScore;
  //   this.item.hasDownvoted = downvoted;
  //   this.item.hasUpvoted = upvoted;
  // }

  showItemModal() {
    if (this.showModalEvent) {
      this.showModalEvent.emit();
    }
  }

  reportItem(item: IItem) {
    var reasons = this.selectedOptions;
    if (reasons.length > 0) {
      var report = {
        reportedItemId: item._id,
        reasons: reasons,
        content: item.files
      };
      this._reportSvc.createReport(report).subscribe(res => {
        item.hasReported = true;
        this._toastr.success("Thank you for helping us improve the quality of contents!");
      }, err => {
        this._toastr.error(err.error.errors.message);
      });
    }
  }

  cancelReportItem(item: IItem) {
    this._reportSvc.cancelReport(item._id).subscribe(res => {
      item.hasReported = false;
      this._toastr.success("Report canceled!");
    }, err => {
      this._toastr.error("Couldn't cancel report!");
    });
  }

  encodeLink(url) {
    return encodeURI(url);
  }

  getPoster(url) {
    return url.replace(/\.[^.]+$/, "_poster.jpg");
  }
}
