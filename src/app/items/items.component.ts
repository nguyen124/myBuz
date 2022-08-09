import { Component, Input, ViewChildren, QueryList } from '@angular/core';
import { IItem } from '../shared/model/item';
import { ItemService } from '../shared/services/item.services';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../shared/services/security/auth.service';
import { CommunicateService } from '../shared/services/utils/communicate.service';
import { ItemComponent } from '../item/item.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent {
  @Input() items: IItem[];
  @Input() baseUrl: string = "/items";
  @Input() isShowingTag: boolean = true;
  @Input() showMap = true;
  @ViewChildren(ItemComponent) childrenItems: QueryList<ItemComponent>;
  nextPage = 0;
  constructor(
    private _itemSvc: ItemService,
    private _toastr: ToastrService,
    public authSvc: AuthService,
    private _commSvc: CommunicateService,
    private _router: Router
  ) {

  }

  deleteItem(index: number, id: string) {
    this._itemSvc.deleteItem(id).subscribe(res => {
      this.items.splice(index, 1);
      this._toastr.success("Item deleted!");
    }, err => {
      this._toastr.error("Delete failed!");
    });
  }

  editItem(itemId: string) {
    this._router.navigate(['/items/' + itemId + '/update']);
  }
}
