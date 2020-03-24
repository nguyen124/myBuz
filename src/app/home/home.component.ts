import { Component, OnInit, ViewChild } from '@angular/core';
import { ItemService } from '../shared/services/item.services';
import { IItem } from '../shared/model/item';
import { ItemsComponent } from '../items/items.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  items: IItem[];
  params: any = {};
  nextPage = 0;

  @ViewChild(ItemsComponent, { static: false }) itemsComponent: ItemsComponent

  constructor(private _itemService: ItemService, private _activatedRoute: ActivatedRoute, private _router: Router) {
    this._activatedRoute.queryParams.subscribe(params => {
      if (Object.entries(params).length === 0 && params.constructor === Object) {
        this.params = {
          perPage: 40,
          tag: '',
          temp: "cold"
        };
        this.getCold();
      } else {
        this.params = Object.assign(this.params, params);
        this.getItems(this.params);
      }
    });
  }

  getItems(params) {
    this._itemService.getItems(params).subscribe((newItems: IItem[]) => {
      this.items = newItems;
    });
  }

  ngOnInit() {

  }

  getHot() {
    Object.assign(this.params, { temp: 'hot' })
    this._router.navigate(['.'], { queryParams: this.params });
  }

  getWarm() {
    Object.assign(this.params, { temp: 'warm' })
    this._router.navigate(['.'], { queryParams: this.params });
  }

  getCold() {
    Object.assign(this.params, { temp: 'cold' })
    this._router.navigate(['.'], { queryParams: this.params });
  }

  loadNext() {
    if (this.items) {
      this.nextPage = Math.floor(this.items.length / this.params.perPage);
    } else {
      this.nextPage = 0;
    }
    var sending = Object.assign({}, this.params, { page: this.nextPage });
    this._itemService.getItems(sending).subscribe((newItems: IItem[]) => {
      for (var i = 0; i < newItems.length; i++) {
        this.items[this.nextPage * this.params.perPage + i] = newItems[i];
      }
    });
  }
}
