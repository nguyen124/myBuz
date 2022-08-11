import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/shared/services/report.services';
import { IReport } from 'src/app/shared/model/report';
import { AuthService } from 'src/app/shared/services/security/auth.service';
import { ItemService } from 'src/app/shared/services/item.services';
import { ToastrService } from 'ngx-toastr';
import { CommentService } from 'src/app/shared/services/comment.services';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  reports: IReport[];

  constructor(
    private _reportSvc: ReportService,
    private _itemSvc: ItemService,
    private _commentSvc: CommentService,
    private _toastr: ToastrService,
    public authSvc: AuthService,
    private _translate: TranslateService) { }

  ngOnInit() {
    this._reportSvc.getReports({}).subscribe(reports => {
      this.reports = reports;
    }, err => {

    })
  }

  accepReportAndDelete(index: number, itemId: string, commentId: string) {
    if (!commentId) {
      this._itemSvc.deleteItem(itemId).subscribe(res => {
        this.reports.splice(index, 1);
        this._toastr.success(this._translate.instant("admin.report.delete.success"));
      }, err => {
        this._toastr.error(this._translate.instant("admin.report.delete.error"));
      });
    } else {
      this._commentSvc.deleteComment(commentId).subscribe(parentComment => {
        this.reports.splice(index, 1);
        this._toastr.success(this._translate.instant("admin.comment.delete.success"));
      }, err => {
        this._toastr.error(this._translate.instant("admin.comment.delete.error"));
      });
    }
  }

  ignoreReport(index: number, itemId: string, commentId: string) {
    this._reportSvc.cancelReport(itemId, commentId).subscribe(res => {
      this.reports.splice(index, 1);
      this._toastr.success(this._translate.instant("admin.report.cancel.success"))
    }, err => {
      this._toastr.error(this._translate.instant("admin.report.cancel.error"))
    });
  }

}
