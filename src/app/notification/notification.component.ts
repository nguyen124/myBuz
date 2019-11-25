import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../shared/services/notification.service';
import { INotification } from '../shared/model/notification';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  notifications: INotification[]
  hasUnreadNotification: Boolean;

  constructor(
    private _notificationSvc: NotificationService
  ) { }

  ngOnInit() {
    this.loadNotification();
  }

  loadNotification() {
    this._notificationSvc.getNotifications({ page: 0 })
      .subscribe(notifications => {
        this.hasUnreadNotification = notifications.reduce(function (accumulator, noti) {
          return accumulator || !noti.hasRead;
        }, false);
        this.notifications = notifications;
      })
  }
}
