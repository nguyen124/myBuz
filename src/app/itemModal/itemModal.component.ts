import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { IItem } from '../shared/model/item';
import { CommunicateService } from '../shared/services/utils/communicate.service';
import { Subscription } from 'rxjs';
import { IComment } from '../shared/model/comment';
import { LoggingService } from '../shared/services/system/logging.service';
import { JQ_TOKEN } from '../shared/services/jQuery.service';

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
    private _commSvc: CommunicateService,
    private _log: LoggingService,
    @Inject(JQ_TOKEN) private $: any) { }

  ngOnInit() {
    this.subScription = this._commSvc.currentItemInModal$.subscribe(item => {
      if (item) {
        this.item = item;
        setTimeout(() => {
          this.$("#openModalBtn").click();
        }, 0);
      }
    });
  }

  ngOnDestroy() {
    this._log.log("Modal destroy");
    this.subScription.unsubscribe();
  }
}
