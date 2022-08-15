import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ItemService } from '../shared/services/item.services';
import { IItem } from '../shared/model/item';
import { ItemsComponent } from '../items/items.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunicateService } from '../shared/services/utils/communicate.service';
import { JQ_TOKEN } from '../shared/services/jQuery.service';
import * as _ from 'lodash';
import { LoggingService } from '../shared/services/system/logging.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  items: IItem[];
  params: any = {};
  nextPage = 0;
  PER_PAGE = 40;
  MAX_ITEMS = this.PER_PAGE * 4;
  currentLength: number;
  offset: number;
  actualPage: any = 0;

  lastParams: any = null;

  @ViewChild(ItemsComponent, { static: false }) itemsComponent: ItemsComponent

  constructor(
    private _itemService: ItemService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _commSvc: CommunicateService,
    private _logSvc: LoggingService,
    @Inject(JQ_TOKEN) private $: any) {
  }

  ngOnInit() {
    this._activatedRoute.queryParams.subscribe(params => {
      this.params = Object.assign({}, this._activatedRoute.snapshot.queryParams);
      this.getItems(this.params);
    });
  }

  getItems(params) {
    let itemId = this._activatedRoute.snapshot.queryParams['id'];
    if (itemId) {
      this._itemService.upview(itemId).subscribe(newItem => {
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
      this.getItemsHelper(this, obj);
    }
  }

  private getItemsHelper(that: any, params: any) {
    that._itemService.getItems(params).subscribe((newItems: IItem[]) => {
      that.items = newItems;
      that.currentLength = that.items.length;
      that.offset = +params.page;
      that.actualPage = params.page ? +params.page : 0;
    });
  }

  loadNext() {
    this.params.perPage = this.params.perPage || this.PER_PAGE;
    if (this.items.length >= this.MAX_ITEMS) {
      this.offset = Math.floor((this.items.length + this.offset * this.params.perPage) / this.params.perPage);
      this.items = [];
      this.nextPage = 0;
    }
    if (this.items) {
      this.nextPage = Math.floor(this.items.length / this.params.perPage);
    } else {
      this.nextPage = 0;
    }
    this.actualPage = this.offset + this.nextPage;
    var sending = Object.assign({}, this.params, { page: this.actualPage });
    this._logSvc.log("Offset: " + this.offset);
    this._itemService.getItems(sending).subscribe((newItems: IItem[]) => {
      for (var i = 0; i < newItems.length; i++) {
        this.items[this.nextPage * this.params.perPage + i] = newItems[i];
      }
      this.currentLength = this.items.length;
    });
  }

  removeFilter(key) {
    delete this.params[key];
    this._router.navigate(['.'], { queryParams: this.params });
  }

  loadPage(event) {
    this.nextPage = +event.target.value;
    this.loadNext();
  }

  setFlag(flag1: boolean, flag2: boolean, flag3: boolean) {
    this._commSvc.setFlag(flag1, flag2, flag3);
  }

  get itemsActive(): boolean {
    return this._commSvc.itemsActive;
  }

  get hiringActive(): boolean {
    return this._commSvc.hiringActive;
  }

  get saleActive(): boolean {
    return this._commSvc.saleActive;
  }
}
