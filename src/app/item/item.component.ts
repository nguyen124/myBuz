import { Component, OnInit, Input } from '@angular/core';
import { IItem } from '../model/item';
import { ItemService } from '../services/item.services';
import { CommunicateService } from '../services/utils/communicate.service';
import { AuthService } from '../services/security/auth.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  @Input()
  item: IItem;
  constructor(
    private _commService: CommunicateService,
    private _itemSvc: ItemService) { }

  ngOnInit() {
    this._itemSvc.getItemInfo(this.item);
  }

  showItemModal() {
    this._commService.changeItem(this.item);
  }
}
