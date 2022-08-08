import { Component, OnInit, Input, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { IItem } from '../shared/model/item';
import { ItemService } from '../shared/services/item.services';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../shared/services/security/auth.service';
import { CommunicateService } from '../shared/services/utils/communicate.service';
import { Subscription } from 'rxjs';
import { ItemComponent } from '../item/item.component';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit, OnDestroy {
  @Input() items: IItem[];
  @Input() baseUrl: string = "/items";
  @Input() isShowingTag: boolean = true;
  @Input() showMap = true;
  @ViewChildren(ItemComponent) childrenItems: QueryList<ItemComponent>;
  subScription: Subscription;
  nextPage = 0;
  constructor(
    private _itemSvc: ItemService,
    private _toastr: ToastrService,
    public authSvc: AuthService,
    private _commSvc: CommunicateService) {

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

  showItemModal(index) {
    this._itemSvc.getItemById(this.items[index]._id).subscribe(newItem => {
      if (newItem) {
        this.items[index].hasUpvoted = newItem.hasUpvoted;
        this.items[index].hasDownvoted = newItem.hasDownvoted;
        this.items[index].noOfComments = newItem.noOfComments;
        this.items[index].noOfPoints = newItem.noOfPoints;
        this.items[index].noOfViews = newItem.noOfViews;
        this._commSvc.changeItem(this.items[index]);
      }
      this.childrenItems.forEach((el, idx) => {
        if (el && idx == index) {
          el.pause();
        }
      });
    });
  }

  handleShowModalEvent(index) {
    this.showItemModal(index);
  }
}
