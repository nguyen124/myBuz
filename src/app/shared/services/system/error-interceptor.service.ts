import { Injectable, Inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UNAUTHORIZED } from 'http-status';
import { Router } from '@angular/router';
import { JQ_TOKEN } from '../jQuery.service';
@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptorService implements HttpInterceptor {

  constructor(private _router: Router, @Inject(JQ_TOKEN) private $: any) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    var that = this;
    return next.handle(request).pipe(catchError(err => {
      if (err.status === UNAUTHORIZED) {
        var backdrop = that.$(".modal-backdrop.fade.show");
        if (backdrop && backdrop[0]) {
          backdrop[0].hidden = true;
        }
        this._router.navigate(["/login"]);
      }
      return throwError(err);
    }))
  }
}
