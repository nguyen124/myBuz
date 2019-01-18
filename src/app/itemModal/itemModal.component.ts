import { Component, OnInit } from '@angular/core';
import { IItem } from '../model/item';
import { CommunicateService } from '../services/communicate-service.service';
import { Subscription } from 'rxjs';
import * as $ from 'jquery';
@Component({
  selector: 'app-itemModal',
  templateUrl: './itemModal.component.html',
  styleUrls: ['./itemModal.component.css']
})
export class ItemModalComponent implements OnInit {

  item: IItem;
  subScription: Subscription;
  constructor(private _commService: CommunicateService) { }

  ngOnInit() {
    this.subScription = this._commService.item$.subscribe(item => {
      this.item = item;
      setTimeout(() => {
        if (item) {
          $("#txtArea").focus();
        }
      }, 500);
    });
  }

  ngOnDestroy() {
    this.subScription.unsubscribe();
  }
}
