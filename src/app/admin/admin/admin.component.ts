import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/shared/services/report.services';
import { IReport } from 'src/app/shared/model/report';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  reports: IReport[];

  constructor(private _reportSvc: ReportService) { }

  ngOnInit() {
    this._reportSvc.getReports({}).subscribe(reports => {
      this.reports = reports;
    }, err => {
      console.log(err);
    })
  }

}
