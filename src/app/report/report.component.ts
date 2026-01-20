import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../shared/services/security/auth.service';
import { IComment } from '../shared/model/comment';
import { ReportService } from '../shared/services/report.services';
import { ToastrService } from 'ngx-toastr';
import { SystemService } from '../shared/services/utils/system.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-report',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.css'],
    standalone: false
})
export class ReportComponent implements OnInit {

  @Input() comment: IComment;

  options = []

  get selectedOptions() {
    return this.options
      .filter(opt => opt.checked)
      .map(opt => opt.value)
  }

  constructor(
    public authSvc: AuthService,
    private _reportSvc: ReportService,
    private _toastr: ToastrService,
    private _systemSvc: SystemService,
    private _translate: TranslateService) { }

  ngOnInit() {
    this.options = this._systemSvc.getReasons();
  }


  reportComment(comment: IComment) {
    var reasons = this.selectedOptions;
    if (reasons.length > 0) {
      var report = {
        reportedItemId: comment.itemId,
        reportedCommentId: comment._id,
        content: comment.content.map(comm => {
          return {
            url: comm.url,
            fileType: comm.fileType
          }
        }),
        reasons: reasons
      };
      this._reportSvc.createReport(report).subscribe(res => {
        comment.hasReported = true;
        this._toastr.success(this._translate.instant("admin.report.create.success"));
      }, err => {
        this._toastr.error(this._translate.instant("admin.report.create.error"));
      })
    }
  }

  cancelReportComment(comment: IComment) {
    this._reportSvc.cancelReport(comment.itemId, comment._id).subscribe(res => {
      comment.hasReported = false;
      this._toastr.success(this._translate.instant("admin.report.cancel.success"));
    }, err => {
      this._toastr.error(this._translate.instant("admin.report.cancel.error"));
    })
  }
}
