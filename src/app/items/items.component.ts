import { Component, Input, ViewChildren, QueryList } from '@angular/core';
import { IItem } from '../shared/model/item';
import { ItemService } from '../shared/services/item.services';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../shared/services/security/auth.service';
import { ItemComponent } from '../item/item.component';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ViewChild } from '@angular/core';
import { PlaceSearchComponent } from '../place-search/place-search.component';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent {
  @Input() items: IItem[];
  @Input() randomItems: IItem[];
  @Input() showMap = true;
  @ViewChildren(ItemComponent) childrenItems: QueryList<ItemComponent>;
  @ViewChild(PlaceSearchComponent, { static: false }) placeSearchComp: PlaceSearchComponent;
  movingIdx = 0;
  nextPage = 0;
  mobile: boolean = false;
  constructor(
    private _itemSvc: ItemService,
    private _toastr: ToastrService,
    public authSvc: AuthService,
    private _translate: TranslateService,
    private _router: Router
  ) {
    if (window.screen.width <= 575) { // 768px portrait
      this.mobile = true;
    }
  }

  deleteItem(index: number, id: string) {
    this._itemSvc.deleteItem(id).subscribe(res => {
      this.items.splice(index, 1);
      this._toastr.success(this._translate.instant("item.delete.success"));
    }, err => {
      this._toastr.error(this._translate.instant("item.delete.error"));
    });
  }

  next() {
    this.movingIdx = (++this.movingIdx) % this.randomItems.length;
  }

  back() {
    this.movingIdx = (--this.movingIdx) % this.randomItems.length;
  }

  deleteRefundItem(index: number, itemId: string) {
    this._itemSvc.deleteRefundItem(itemId).subscribe(res => {
      this.items[index].status = res.status;
      this._toastr.success(this._translate.instant("item.delete.success"));
    }, err => {
      this._toastr.error(this._translate.instant("item.delete.error"));
    });
  }

  editItem(itemId: string) {
    this._router.navigate(['/business/' + itemId + '/update']);
  }
}
