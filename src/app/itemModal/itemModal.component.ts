import { Component, OnInit, OnDestroy, Inject, ViewChild, HostListener, ElementRef, ViewEncapsulation } from '@angular/core';
import { IItem } from '../shared/model/item';
import { CommunicateService } from '../shared/services/utils/communicate.service';
import { Subscription } from 'rxjs';
import { IComment } from '../shared/model/comment';
import { LoggingService } from '../shared/services/system/logging.service';
import { JQ_TOKEN } from '../shared/services/jQuery.service';
import { CommentsComponent } from '../comments/comments.component';
import { MetaTagService } from '../shared/services/meta-tag.services';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-itemModal',
  templateUrl: './itemModal.component.html',
  styleUrls: ['./itemModal.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ItemModalComponent implements OnInit, OnDestroy {
  item: IItem;
  comment: IComment
  subScription: Subscription;

  @ViewChild(CommentsComponent, { static: true }) commentsComp: CommentsComponent;
  @ViewChild('closeModalBtn', { static: false }) closeModalBtn: ElementRef;

  @HostListener('document:keydown.escape', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.clearData();
  }

  constructor(
    private _commSvc: CommunicateService,
    private _log: LoggingService,
    private titleTagService: MetaTagService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    @Inject(JQ_TOKEN) private $: any) {
  }

  ngOnInit() {
    this.subScription = this._commSvc.currentItemInModal$.subscribe(item => {
      if (item) {
        this.item = item;
        setTimeout(() => {
          this.$("#openModalBtn").click();
        }, 0);
        this.setMetaTags();
      }
    });
  }

  setMetaTags() {
    this.titleTagService.setTitle(this.item.title);
    this.titleTagService.setSocialMediaTags(
      "https://me2meme.com/business?id=" + this.item._id,
      this.item.title,
      this.item.description,
      this.getThumbNailImage());
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
    //this._log.log("Modal destroy");
    this.subScription.unsubscribe();
  }

  closeModal() {
    this.closeModalBtn.nativeElement.click();
    this.clearData();
  }

  clearData() {
    let params = Object.assign({}, this._activatedRoute.snapshot.queryParams, { id: null });
    this._router.navigate([], {
      queryParams: params,
      queryParamsHandling: 'merge'
    });
  }

  getThumbNailImage() {
    if (this.item && this.item.files && this.item.files.length > 0) {
      var fileType = this.item.files[0].fileType;
      if (fileType.startsWith("video")) {
        return this.getPoster(this.item.files[0].url);
      } else if (fileType.startsWith("image")) {
        return this.item.files[0].url;
      }
    }
    return "https://me2meme.com/assets/image/logo256x215.png";
  }

  getPoster(url) {
    return url.replace(/\.[^.]+$/, "_poster.jpg");
  }
}
