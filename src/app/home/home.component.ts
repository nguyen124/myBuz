import { Component, OnInit, ViewChild } from '@angular/core';
import { ItemService } from '../shared/services/item.services';
import { IItem } from '../shared/model/item';
import { ItemsComponent } from '../items/items.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunicateService } from '../shared/services/utils/communicate.service';

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
  actualPage: any;

  @ViewChild(ItemsComponent, { static: false }) itemsComponent: ItemsComponent

  constructor(
    private _itemService: ItemService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _commSvc: CommunicateService) {
    this._activatedRoute.queryParams.subscribe(params => {
      if (Object.entries(params).length === 0 && params.constructor === Object) {
        this.params = {
          temp: "cold",
          page: 0,
          perPage: this.PER_PAGE
        };
        this.getCold();
      } else {
        var itemId = this._activatedRoute.snapshot.queryParams['id'];
        if (!itemId) {
          this.params = Object.assign({}, this._activatedRoute.snapshot.queryParams);
        }
        this.getItems(this.params);
      }
    });
  }

  getItems(params) {
    let itemId = this._activatedRoute.snapshot.queryParams['id'];
    let that = this;
    if (itemId) {
      this._itemService.getItemById(itemId).subscribe(item => {
        window.history.pushState('item', 'details', '/svc/metatags?id=' + item._id);
        that._commSvc.changeItem(item);
        that.getItemsHelper(that, params);
      });
    } else {
      that.getItemsHelper(that, params);
    }
  }

  private getItemsHelper(that, params) {
    that._itemService.getItems(params).subscribe((newItems: IItem[]) => {
      that.items = newItems;
      that.currentLength = that.items.length;
      that.offset = +params.page;
      that.actualPage = params.page ? +params.page : 0;
    });
  }

  ngOnInit() {

  }

  getHot() {
    Object.assign(this.params, { temp: 'hot', page: 0, perPage: this.PER_PAGE })
    this._router.navigate(['.'], { queryParams: this.params });
  }

  getWarm() {
    Object.assign(this.params, { temp: 'warm', page: 0, perPage: this.PER_PAGE })
    this._router.navigate(['.'], { queryParams: this.params });
  }

  getCold() {
    Object.assign(this.params, { temp: 'cold', page: 0, perPage: this.PER_PAGE })
    this._router.navigate(['.'], { queryParams: this.params });
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
    console.log("Offset: " + this.offset);
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
    console.log("Load page: " + event.target.value);
    this.loadNext();
  }
}
