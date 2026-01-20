import { Component, OnInit, Inject } from '@angular/core';
import { NotificationService } from '../shared/services/notification.service';
import { INotification } from '../shared/model/notification';
import { JQ_TOKEN } from '../shared/services/jQuery.service';
import { ItemService } from '../shared/services/item.services';
import { CommunicateService } from '../shared/services/utils/communicate.service';

@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.css'],
    standalone: false
})
export class NotificationComponent implements OnInit {
  notifications: INotification[]
  hasUnreadNotification: Boolean;
  PER_PAGE = 5;
  nextPage = 0;
  constructor(
    private _notificationSvc: NotificationService,
    private _itemSvc: ItemService,
    private _commSvc: CommunicateService,
    @Inject(JQ_TOKEN) private $: any
  ) { }

  ngOnInit() {
    this._notificationSvc.checkIfThereIsNewNotifications()
      .subscribe(result => {
        this.hasUnreadNotification = result;
      });
    this.$('#showMoreNotifications').on('click', function (e) {
      e.stopPropagation(); // prevent dropdown close
    });
  }

  loadNotifications() {
    this.nextPage = 0;
    this.hasUnreadNotification = false;
    this._notificationSvc.getNotifications({ page: this.nextPage }).subscribe(notifications => {
      this.notifications = notifications;
    });
  }

  showMoreNotifications() {
    this.nextPage = Math.floor(this.notifications.length / this.PER_PAGE);
    this._notificationSvc.getNotifications({ page: this.nextPage }).subscribe((nextPageNotifications) => {
      for (var i = 0; i < nextPageNotifications.length; i++) {
        this.notifications[this.nextPage * this.PER_PAGE + i] = nextPageNotifications[i];
      }
    });
  }

  openItem(itemId: string) {
    this._itemSvc.getItemById(itemId).subscribe(item => {
      this._commSvc.changeItem(item);
    });
  }
}
