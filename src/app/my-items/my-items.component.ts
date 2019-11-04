import { Component, OnInit, OnDestroy } from '@angular/core';
import { IItem } from '../shared/model/item';
import { UserService } from '../shared/services/user-service.service';
import { ItemService } from '../shared/services/item.services';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CommunicateService } from '../shared/services/utils/communicate.service';

@Component({
  selector: 'app-my-items',
  templateUrl: './my-items.component.html',
  styleUrls: ['./my-items.component.css']
})
export class MyItemsComponent implements OnInit, OnDestroy {
  items: IItem[];
  subScription: Subscription;
  constructor(
    private _userSvc: UserService,
    private _itemSvc: ItemService,
    private _commSvc: CommunicateService,
    private _toastr: ToastrService) {
  }

  ngOnInit() {
    this._userSvc.getMyItems().subscribe((items: IItem[]) => {
      this.items = items;
    });
    this.subScription = this._commSvc.newUploadedItem$.subscribe((item: IItem) => {
      if (this.items) {
        this.items.push(item);
      }
    });
  }

  deleteItem(index: number, id: string) {
    this._itemSvc.deleteItem(id).subscribe(res => {
      this.items.splice(index, 1);
      this._toastr.success("Delete succeeded!");
    }, err => {
      this._toastr.error("Delete failed!");
    });
  }

  ngOnDestroy() {
    this.subScription.unsubscribe();
  }
}
