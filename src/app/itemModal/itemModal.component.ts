import { Component, OnInit, OnDestroy } from '@angular/core';
import { IItem } from '../shared/model/item';
import { CommunicateService } from '../shared/services/utils/communicate.service';
import { Subscription } from 'rxjs';
import * as $ from 'jquery';
import { IComment } from '../shared/model/comment';
import { LoggingService } from '../shared/services/system/logging.service';

@Component({
  selector: 'app-itemModal',
  templateUrl: './itemModal.component.html',
  styleUrls: ['./itemModal.component.css']
})
export class ItemModalComponent implements OnInit, OnDestroy {
  item: IItem;
  comment: IComment
  subScription: Subscription;

  constructor(
    private _commService: CommunicateService,
    private _log: LoggingService) { }

  ngOnInit() {
    this.subScription = this._commService.currentItemInModal$.subscribe(item => {
      if (item) {
        this.item = item;
        setTimeout(() => {
          $("#txtReplyBox").focus();
        }, 500);
      }
    });
  }

  ngOnDestroy() {
    this._log.log("destroy");
    this.subScription.unsubscribe();
  }
}
