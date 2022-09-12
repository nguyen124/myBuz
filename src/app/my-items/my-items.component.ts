import { Component, OnInit, Inject, isDevMode } from '@angular/core';
import { IItem } from '../shared/model/item';
import { ItemService } from '../shared/services/item.services';
import { AuthService } from '../shared/services/security/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunicateService } from '../shared/services/utils/communicate.service';
import { JQ_TOKEN } from '../shared/services/jQuery.service';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../environments/environment';
import { environment as prodEnvironment } from '../../environments/environment.prod';

@Component({
  selector: 'app-my-items',
  templateUrl: './my-items.component.html',
  styleUrls: ['./my-items.component.css']
})
export class MyItemsComponent implements OnInit {
  items: IItem[];
  nextPage = 0;  
  readonly PER_PAGE: number = isDevMode() ? environment.ITEM_PER_PAGE : prodEnvironment.ITEM_PER_PAGE;
  params: any = {};
  actualPage: any = 0;
  lastParams = null;

  constructor(
    private _itemSvc: ItemService,
    private authSvc: AuthService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _commSvc: CommunicateService,
    private _toastr: ToastrService,
    private _translate: TranslateService,
    @Inject(JQ_TOKEN) private $: any) {
    let params = this._activatedRoute.snapshot.queryParams;
    this._router.navigate([], {
      queryParams: Object.assign({ page: 0, perPage: this.PER_PAGE }, params),
      queryParamsHandling: "merge"
    });
  }

  ngOnInit() {
    this._activatedRoute.queryParams.subscribe(newParams => {
      this.params = Object.assign({}, newParams);
      this.getMyItems(Object.assign({ createdBy: this.authSvc.user._id }, this.params));
    });
  }

  getMyItems(params) {
    let itemId = this._activatedRoute.snapshot.queryParams['id'];
    if (itemId) {
      this._itemSvc.getItemById(itemId).subscribe(newItem => {
        this._commSvc.changeItem(newItem);
      });
    } else {
      var modalDismiss = this.$("#closeModalBtn");
      if (modalDismiss && modalDismiss[0]) { modalDismiss.click(); }
    }
    let obj = Object.assign({}, params);
    delete obj.id;
    if (!_.isEqual(this.lastParams, obj)) {
      this.lastParams = obj;
      this.getMyItemsHelper(this, obj);
    }
  }

  private getMyItemsHelper(that, params) {
    that._itemSvc.getMyItems(params).subscribe((newItems: IItem[]) => {
      that.items = newItems;
      that.currentLength = that.items.length;
      that.actualPage = params.page ? +params.page : 0;
    });
  }

  loadNext() {
    var sending = Object.assign({}, this.params, { page: ++this.nextPage });
    this._router.navigate([], { queryParams: sending });
  }

  removeFilter(key) {
    delete this.params[key];
    this._router.navigate([], { queryParams: this.params });
  }

  editItem(itemId: string) {
    this._router.navigate(['/business/' + itemId + '/update']);
  }

  deleteItem(index: number, id: string) {
    this._itemSvc.deleteItem(id).subscribe(res => {
      this.items.splice(index, 1);
      this._toastr.success(this._translate.instant("item.delete.success"));
    }, err => {
      this._toastr.error(this._translate.instant("item.delete.error"));
    });
  }

  deleteRefundItem(index: number, itemId: string) {
    this._itemSvc.deleteRefundItem(itemId).subscribe(res => {
      this.items[index].status = res.status;
      this._toastr.success(this._translate.instant("item.delete.success"));
    }, err => {
      this._toastr.error(this._translate.instant("item.delete.error"));
    });
  }
}
