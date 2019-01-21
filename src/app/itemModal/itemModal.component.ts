import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { IItem } from '../model/item';
import { CommunicateService } from '../services/communicate-service.service';
import { Subscription } from 'rxjs';
import * as $ from 'jquery';
import { IComment } from '../model/comment';

@Component({
  selector: 'app-itemModal',
  templateUrl: './itemModal.component.html',
  styleUrls: ['./itemModal.component.css']
})
export class ItemModalComponent implements OnInit {  
  item: IItem;
  comment:IComment
  @Output()
  onWritingComment: EventEmitter<IComment> = new EventEmitter<IComment>();
  subScription: Subscription;  
  constructor(private _commService: CommunicateService) { }

  ngOnInit() {
    this.subScription = this._commService.newItem$.subscribe(item => {
      if (item) {
        this.item = item;
        setTimeout(() => {
          $("#txtReplyBox").focus();
        }, 500);
      }
    });
  }


  ngOnDestroy() {
    this.subScription.unsubscribe();
  }
}
