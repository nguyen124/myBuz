import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ItemService } from '../shared/services/item.services';
import { IItem } from '../shared/model/item';
import { ItemsComponent } from '../items/items.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunicateService } from '../shared/services/utils/communicate.service';
import { JQ_TOKEN } from '../shared/services/jQuery.service';
import * as _ from 'lodash';
import { LoggingService } from '../shared/services/system/logging.service';
import { GoogleMapService } from '../shared/services/google-map.service';
import { AfterViewInit } from '@angular/core';
import { GoogleSeoService } from '../google-seo.service';

@Component({
  selector: 'app-hiring',
  templateUrl: './hiring.component.html',
  styleUrls: ['./hiring.component.css']
})
export class HiringComponent implements OnInit, AfterViewInit {
  items: IItem[];
  randomItems: IItem[];
  params: any = {};
  nextPage = 0;
  PER_PAGE = 40;
  MAX_ITEMS = this.PER_PAGE * 4;
  currentLength: number;
  actualPage: any = 0;
  lastParams: any = null;

  @ViewChild(ItemsComponent, { static: false }) itemsComponent: ItemsComponent;

  constructor(
    private _itemService: ItemService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _commSvc: CommunicateService,
    private _logSvc: LoggingService,
    private _apiService: GoogleMapService,
    private _seoService: GoogleSeoService,
    @Inject(JQ_TOKEN) private $: any) {
  }

  async ngOnInit() {
    this.createLinkForCanonicalURL();
    this._activatedRoute.queryParams.subscribe(params => {
      this.params = Object.assign({ need: 'hiring' }, this._activatedRoute.snapshot.queryParams);
      this.getItems(this.params);
      this.getRandomItems();
    });
  }

  getRandomItems() {
    this._itemService.getRandomItems().subscribe((randomItems: IItem[]) => {
      this.randomItems = randomItems;
    });
  }

  createLinkForCanonicalURL() {
    this._seoService.createLinkForCanonicalURL();
  }

  ngAfterViewInit() {
    this.itemsComponent.placeSearchComp.showMaxPrice = false;
    this.itemsComponent.placeSearchComp.showMinPrice = false;
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

  loadPage(event) {
    this.nextPage = +event.target.value;
    this.loadNext();
  }

  setFlag(flag1: boolean, flag2: boolean, flag3: boolean) {
    this._commSvc.setFlag(flag1, flag2, flag3);
  }

  get businessForSaleActive(): boolean {
    return this._commSvc.businessForSaleActive;
  }

  get hiringActive(): boolean {
    return this._commSvc.hiringActive;
  }

  get otherForSaleActive(): boolean {
    return this._commSvc.otherForSaleActive;
  }
}
