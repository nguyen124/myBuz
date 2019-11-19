import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../shared/services/security/auth.service';
import { IComment } from '../shared/model/comment';
import { ReportService } from '../shared/services/report.services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  @Input() comment: IComment;

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
    public _authSvc: AuthService,
    private _reportSvc: ReportService,
    private _toastr: ToastrService) { }

  ngOnInit() {
  }


  reportComment(comment: IComment) {
    var reasons = this.selectedOptions;
    if (reasons.length > 0) {
      var report = {
        reportedItemId: comment.itemId,
        reportedCommentId: comment._id,
        reasons: reasons
      };
      this._reportSvc.createReport(report).subscribe(res => {
        comment.hasReported = true;
        this._toastr.success("Report submitted!")
      }, err => {
        this._toastr.error("Couldn't submit report!")
      })
    }
  }

  cancelReportComment(comment: IComment) {
    this._reportSvc.cancelReport(comment._id).subscribe(res => {
      this._toastr.success("Report canceled!")
      comment.hasReported = false
    }, err => {
      this._toastr.error("Couldn't cancel report!")
    })
  }
}
