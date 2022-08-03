import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  constructor(private _http: HttpClient) {
  }

  makePayment(body: any): Observable<any> {
    return this._http.post<any>("/svc/stripe/checkout", body);
  }

  refund(body: any): Observable<any> {
    return this._http.post<any>("svc/stripe/refund", body);
  }
}
