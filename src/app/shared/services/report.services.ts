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
        return this._http.post("/svc/reports/create", report);
    }

    cancelReport(itemId: string, commentId?: string): Observable<any> {
        var reportedComment = commentId ? "&reportedCommentId=" + commentId : "";
        return this._http.delete("/svc/reports/delete?reportedItemId=" + itemId + reportedComment);
    }

    getReports(params): Observable<IReport[]> {
        return this._http.get<IReport[]>("/svc/reports", { params: params });
    }
}
