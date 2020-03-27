import { Component, OnInit, OnDestroy, Inject, ViewChild, HostListener } from '@angular/core';
import { IItem } from '../shared/model/item';
import { CommunicateService } from '../shared/services/utils/communicate.service';
import { Subscription } from 'rxjs';
import { IComment } from '../shared/model/comment';
import { LoggingService } from '../shared/services/system/logging.service';
import { JQ_TOKEN } from '../shared/services/jQuery.service';
import { CommentsComponent } from '../comments/comments.component';

@Component({
  selector: 'app-itemModal',
  templateUrl: './itemModal.component.html',
  styleUrls: ['./itemModal.component.css']
})
export class ItemModalComponent implements OnInit, OnDestroy {
  item: IItem;
  comment: IComment
  subScription: Subscription;

  @ViewChild(CommentsComponent, { static: false }) commentsComp: CommentsComponent;

  @HostListener('document:keydown.escape', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.clearData();
  }

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
          this.commentsComp.getComments(this.item);
        }, 0);
      }
    });
  }

  handleTopCommentBoxFocus(value) {
    if (value == "top") {
      this.hideAllOtherCommentsBoxes();
    }
  }

  hideAllOtherCommentsBoxes() {
    if (this.commentsComp) {
      this.commentsComp.hidePreviousShowingCommentBox(null);
    }
  }

  ngOnDestroy() {
    this._log.log("Modal destroy");
    this.subScription.unsubscribe();
  }

  closeModal() {
    this.$("#closeModalBtn").click();
    this.clearData();
  }

  clearData() {
    this.item = null;    
  }
}
