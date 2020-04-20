import { Component, OnInit, Input } from '@angular/core';
import { IItem } from '../shared/model/item';
import { CommunicateService } from '../shared/services/utils/communicate.service';
import { CommentService } from '../shared/services/comment.services';
import { ItemService } from '../shared/services/item.services';
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

  options = [];

  get selectedOptions() {
    return this.options
      .filter(opt => opt.checked)
      .map(opt => opt.value)
  }

  constructor(
    private _commentSvc: CommentService,
    private _itemSvc: ItemService,
    private _commSvc: CommunicateService,
    private _reportSvc: ReportService,
    private _toastr: ToastrService,
    private _systemSvc: SystemService,
    public authSvc: AuthService) {
  }

  ngOnInit() {
    this.options = this._systemSvc.getReasons();
  }

  upvote(): void {
    if (!this.item.hasUpvoted) {
      this._commentSvc.upvote(this.item._id).subscribe(newScore => {
        this.setInfo(newScore, true, false);
      });
    } else {
      this._commentSvc.unvote(this.item._id).subscribe(newScore => {
        this.setInfo(newScore, false, false);
      });
    }
  }

  downvote(): void {
    if (!this.item.hasDownvoted) {
      this._commentSvc.downvote(this.item._id).subscribe(newScore => {
        this.setInfo(newScore, false, true);
      });
    } else {
      this._commentSvc.unvote(this.item._id).subscribe(newScore => {
        this.setInfo(newScore, false, false);
      });
    }
  }

  setInfo(newScore, upvoted, downvoted) {
    this.item.noOfPoints = newScore;
    this.item.hasDownvoted = downvoted;
    this.item.hasUpvoted = upvoted;
  }

  showItemModal() {
    this._itemSvc.getItemById(this.item._id).subscribe(newItem => {
      if (newItem) {
        this.item.hasUpvoted = newItem.hasUpvoted;
        this.item.hasDownvoted = newItem.hasDownvoted;
        this.item.noOfComments = newItem.noOfComments;
        this.item.noOfPoints = newItem.noOfPoints;
        this.item.noOfViews = newItem.noOfViews;
        this._commSvc.changeItem(this.item);
      }
    });
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
}
