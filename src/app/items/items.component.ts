import { Component, OnInit } from '@angular/core';
import { FileUtils } from '../utils/FileUtils';
import { IItem } from '../model/item';
import { ItemService } from '../services/item.services';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  filterType: string;
  items: IItem[];
  selectedRadioValue: string = "all";

  constructor(private _itemService: ItemService) {

  }

  ngOnInit() {
    this.items = this._itemService.getItems();
  }

  getFileType(item: any) {
    return FileUtils.getFileType(item.url);
  }

  getItemsCount(): number {
    return this.items.length;
  }
  getSeenItemsCount(): number {
    return this.items.filter(e => e.viewed === "seen").length;
  }
  getNotSeenItemsCount(): number {
    return this.items.filter(e => e.viewed === "notSeen").length;
  }
  getGlancedItemsCount(): number {
    return this.items.filter(e => e.viewed === "glanced").length;
  }
  onRadioChanged(selectedRadioValue: string) {
    this.selectedRadioValue = selectedRadioValue;
  }
}
