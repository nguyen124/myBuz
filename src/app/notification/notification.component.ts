import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../shared/services/notification.service';
import { INotification } from '../shared/model/notification';
import { AuthService } from '../shared/services/security/auth.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  notifications: INotification[]

  constructor(
    private _notificationSvc: NotificationService) { }

  ngOnInit() {
    this._notificationSvc.getNotifications({ page: 0 })
      .subscribe(notifications => {
        this.notifications = notifications;
      })
  }

}
