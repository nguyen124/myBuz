import { Component, OnInit, Inject } from '@angular/core';
import { IItem } from '../shared/model/item';
import { ItemService } from '../shared/services/item.services';
import { AuthService } from '../shared/services/security/auth.service';
import { ActivatedRoute } from '@angular/router';
import { CommunicateService } from '../shared/services/utils/communicate.service';
import { JQ_TOKEN } from '../shared/services/jQuery.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-my-items',
  templateUrl: './my-items.component.html',
  styleUrls: ['./my-items.component.css']
})
export class MyItemsComponent implements OnInit {
  items: IItem[];
  baseUrl: string = "/user/business";
  nextPage = 0;
  PER_PAGE = 40;
  params: any = {};
  lastParams = null;
  constructor(
    private _itemService: ItemService,
    private _authSvc: AuthService,
    private _activatedRoute: ActivatedRoute,
    private _commSvc: CommunicateService,
    @Inject(JQ_TOKEN) private $: any) {

  }

  ngOnInit() {
    this._activatedRoute.queryParams.subscribe(newParams => {
      this.params = Object.assign({ page: this.nextPage, createdBy: this._authSvc.user._id }, newParams);
      this.getItems(this.params);
    });
  }

  getItems(params) {
    let itemId = this._activatedRoute.snapshot.queryParams['id'];
    if (itemId) {
      this._itemService.getItemById(itemId).subscribe(newItem => {
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

  private getItemsHelper(that, params) {
    that._itemService.getItems(params).subscribe((newItems: IItem[]) => {
      that.items = newItems;
      that.currentLength = that.items.length;
      that.offset = +params.page;
      that.actualPage = params.page ? +params.page : 0;
    });
  }

  loadNext() {
    if (this.items) {
      this.nextPage = Math.floor(this.items.length / this.PER_PAGE);
    } else {
      this.nextPage = 0;
    }
    this._itemService.getItems({ page: this.nextPage, createdBy: this._authSvc.user._id }).subscribe((newItems: IItem[]) => {
      for (var i = 0; i < newItems.length; i++) {
        this.items[this.nextPage * this.PER_PAGE + i] = newItems[i];
      }
    });
  }
}
