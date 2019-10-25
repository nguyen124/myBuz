import { Component, OnInit, Input } from '@angular/core';
import { IItem } from '../shared/model/item';
import { CommunicateService } from '../shared/services/utils/communicate.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  @Input()
  item: IItem;
  constructor(
    private _commService: CommunicateService) { }

  ngOnInit() {
  }

  showItemModal() {
    this._commService.changeItem(this.item);
  }
}

