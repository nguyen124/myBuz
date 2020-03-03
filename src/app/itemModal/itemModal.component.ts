import { Component, OnInit, OnDestroy, Inject, ViewChild } from '@angular/core';
import { IItem } from '../shared/model/item';
import { CommunicateService } from '../shared/services/utils/communicate.service';
import { Subscription } from 'rxjs';
import { IComment } from '../shared/model/comment';
import { LoggingService } from '../shared/services/system/logging.service';
import { JQ_TOKEN } from '../shared/services/jQuery.service';
import { CommentsComponent } from '../comments/comments.component';
import { CommentBoxComponent } from '../comment-box/comment-box.component';

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
      this.commentsComp.hidePreviousShowingCommentBox();
    }
  }

  ngOnDestroy() {
    this._log.log("Modal destroy");
    this.subScription.unsubscribe();
  }
}
