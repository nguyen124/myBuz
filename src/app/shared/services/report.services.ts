import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IReport } from '../model/report';


@Injectable({
    providedIn: 'root'
})
export class ReportService {

    constructor(private _http: HttpClient) { }

    createReport(report: IReport): Observable<any> {
        return this._http.post("/svc/reports", report);
    }

    cancelReport(itemId: string): Observable<any> {
        return this._http.delete("/svc/reports?reportedItemId=" + itemId);
    }
}
