import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { INotification } from '../model/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private _http: HttpClient) { }

  getNotifications(params) {
    return this._http.get<INotification[]>("/svc/notifications", { params: params })
  }
}
