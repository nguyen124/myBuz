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
import { RenderService } from '../shared/services/utils/render.service';
import { Editor } from 'ngx-editor';
import { AuthService } from '../shared/services/security/auth.service';
import { ItemService } from '../shared/services/item.services';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-itemModal',
    templateUrl: './itemModal.component.html',
    styleUrls: ['./itemModal.component.css'],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class ItemModalComponent implements OnInit, OnDestroy {
  item: IItem;
  comment: IComment
  subScription: Subscription;
  needsMap: any = {};
  categoriesMap: any = {};
  editor: Editor;
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
    private _renderSvc: RenderService,
    private authSvc: AuthService,
    private _itemSvc: ItemService,
    private _toastr: ToastrService,
    private _translate: TranslateService,
    @Inject(JQ_TOKEN) private $: any) {
  }

  ngOnInit() {
    this.editor = new Editor();
    this.subScription = this._commSvc.currentItemInModal$.subscribe((item?: any) => {
      if (item) {
        this.item = item;
        this.needsMap = {
          "forSale": false,
          "forLease": false,
          "forShare": false,
          "hiring": false
        };
        if (item) {
          for (let need of item.needs) {
            this.needsMap[need] = true;
          }
        }
        this.categoriesMap = {
          "Nail_Salon": false,
          "Hair_Salon": false,
          "Restaurant": false,
          "House": false,
          "Repair": false,
          "Tax": false,
          "Insurance": false,
          "Lending": false,
          "Babysit": false,
          "Teaching": false,
          "Other_Business": false,
        };
        if (item) {
          this.categoriesMap[item.categories] = true;
        }

        setTimeout(() => {
          this.$("#openModalBtn").click();
        }, 0);
        this.setMetaTags();
      }
    });
  }

  deleteItem(id: string) {
    this.closeModal();
    this._itemSvc.deleteItem(id).subscribe(res => {
      this._toastr.success(this._translate.instant("item.delete.success"));
    }, err => {
      this._toastr.error(this._translate.instant("item.delete.error"));
    });
  }

  deleteRefundItem(itemId: string) {
    this.closeModal();
    this._itemSvc.deleteRefundItem(itemId).subscribe(res => {
      this._toastr.success(this._translate.instant("item.delete.success"));
    }, err => {
      this._toastr.error(this._translate.instant("item.delete.error"));
    });
  }

  editItem(itemId: string) {
    this.closeModal();
    this._router.navigate(['/business/' + itemId + '/update']);
  }

  setMetaTags() {
    this.titleTagService.setTitle(this.item.title);
    this.titleTagService.setSocialMediaTags(
      "https://troiviet.com/business?id=" + this.item._id,
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
    return "https://troiviet.com/assets/image/newlogo256x187.png";
  }

  getPoster(url) {
    return url.replace(/\.[^.]+$/, "_poster.jpg");
  }

  get showPrice(): boolean {
    return this._renderSvc.showPrice(this.needsMap, this.categoriesMap);
  }

  get showWage(): boolean {
    return this._renderSvc.showWage(this.needsMap, this.categoriesMap);
  }

  get showNoOfEmployees(): boolean {
    return this._renderSvc.showNoOfEmployees(this.needsMap, this.categoriesMap);
  }

  get showNoOfChairs(): boolean {
    return this._renderSvc.showNoOfChairs(this.needsMap, this.categoriesMap);
  }

  get showNoOfTables(): boolean {
    return this._renderSvc.showNoOfTables(this.needsMap, this.categoriesMap);
  }

  get showIncome(): boolean {
    return this._renderSvc.showIncome(this.needsMap, this.categoriesMap);
  }

  get showRent(): boolean {
    return this._renderSvc.showRent(this.needsMap, this.categoriesMap);
  }

  get showOtherCost(): boolean {
    return this._renderSvc.showOtherCost(this.needsMap, this.categoriesMap);
  }

  get showLeaseEnd(): boolean {
    return this._renderSvc.showLeaseEnd(this.needsMap, this.categoriesMap);
  }

  get showArea(): boolean {
    return this._renderSvc.showArea(this.needsMap, this.categoriesMap);
  }

  get showYearsOld(): boolean {
    return this._renderSvc.showYearsOld(this.needsMap, this.categoriesMap);
  }
}
