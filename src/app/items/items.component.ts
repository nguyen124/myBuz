import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { IItem } from '../shared/model/item';
import { ItemService } from '../shared/services/item.services';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../shared/services/security/auth.service';
import { CommunicateService } from '../shared/services/utils/communicate.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit, OnDestroy {
  @Input()
  items: IItem[];
  @Input()
  baseUrl: string = "/items";
  @Input()
  isShowingTag: boolean;

  subScription: Subscription;
  nextPage = 0;
  perPage = 4;

  constructor(
    private _itemSvc: ItemService,
    private _toastr: ToastrService,
    public authSvc: AuthService,
    private _commSvc: CommunicateService,
    private _itemService: ItemService) {

  }

  ngOnInit() {
    this.subScription = this._commSvc.newUploadedItem$.subscribe((item: IItem) => {
      if (this.items) {
        this.items.push(item);
      }
    });
  }

  deleteItem(index: number, id: string) {
    this._itemSvc.deleteItem(id).subscribe(res => {
      this.items.splice(index, 1);
      this._toastr.success("Item deleted!");
    }, err => {
      this._toastr.error("Delete failed!");
    });
  }

  ngOnDestroy() {
    if (this.subScription) {
      this.subScription.unsubscribe();
    }
  }

  loadNext() {
    if (this.items) {
      this.nextPage = Math.floor(this.items.length / this.perPage);
    } else {
      this.nextPage = 0;
    }
    this._itemService.getItems({ page: this.nextPage }).subscribe((newItems: IItem[]) => {
      for (var i = 0; i < newItems.length; i++) {
        this.items[this.nextPage * this.perPage + i] = newItems[i];
      }
    });
  }
}
