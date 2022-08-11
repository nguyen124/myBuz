import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { IItem } from '../shared/model/item';
import { CommentService } from '../shared/services/comment.services';
import { AuthService } from '../shared/services/security/auth.service';
import { ReportService } from '../shared/services/report.services';
import { ToastrService } from 'ngx-toastr';
import { SystemService } from '../shared/services/utils/system.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-react',
  templateUrl: './react.component.html',
  styleUrls: ['./react.component.css']
})
export class ReactComponent implements OnInit {
  @Input() baseUrl: string;
  @Input() item: IItem;
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
    private _translate: TranslateService,
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
        this._toastr.success(this._translate.instant("admin.report.create.success"));
      }, err => {
        this._toastr.error(this._translate.instant("admin.report.create.error"));
      });
    }
  }

  cancelReportItem(item: IItem) {
    this._reportSvc.cancelReport(item._id).subscribe(res => {
      item.hasReported = false;
      this._toastr.success(this._translate.instant("admin.report.cancel.success"));
    }, err => {
      this._toastr.error(this._translate.instant("admin.report.cancel.error"));
    });
  }

  encodeLink(url) {
    return encodeURI(url);
  }

  getPoster(url) {
    return url.replace(/\.[^.]+$/, "_poster.jpg");
  }
}
