import { Component, OnInit, Input } from '@angular/core';
import { IItem } from '../shared/model/item';
import { CommunicateService } from '../shared/services/utils/communicate.service';
import { CommentService } from '../shared/services/comment.services';
import { ItemService } from '../shared/services/item.services';
import { AuthService } from '../shared/services/security/auth.service';
import { ReportService } from '../shared/services/report.services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-react',
  templateUrl: './react.component.html',
  styleUrls: ['./react.component.css']
})
export class ReactComponent implements OnInit {
  @Input()
  item: IItem;

  options = [
    { name: 'OptionA', value: '1', checked: false },
    { name: 'OptionB', value: '2', checked: false },
    { name: 'OptionC', value: '3', checked: false }
  ]

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
    public _authSvc: AuthService) {
  }

  ngOnInit() {
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
    this._itemSvc.getItems({ id: this.item._id }).subscribe(newItems => {
      if (newItems.length > 0) {
        this.item = newItems[0];
        this._commSvc.changeItem(this.item);
      }
    });
  }

  reportItem(item: IItem) {
    var reasons = this.selectedOptions;
    if (reasons.length > 0) {
      var report = {
        reportedItemId: item._id,
        reasons: reasons
      };
      this._reportSvc.createReport(report).subscribe(res => {
        item.hasReported = true;
        this._toastr.success("Report submitted!")
      }, err => {
        this._toastr.error("Couldn't submit report!")
      })
    }
  }

  cancelReportItem(item: IItem) {
    this._reportSvc.cancelReport(item._id).subscribe(res => {
      this._toastr.success("Report canceled!")
      item.hasReported = false
    }, err => {
      this._toastr.error("Couldn't cancel report!")
    })
  }
}
