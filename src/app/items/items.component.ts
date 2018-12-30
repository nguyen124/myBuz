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
  showWaitingMessage = false;
  //outline = "col-lg-3 col-md-4 col-xs-6 pb-3"
  constructor(private _itemService: ItemService) {

  }

  ngOnInit() {
    this._itemService.getItems().subscribe((items) => {
      this.items = items;
    });
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
  viewItemDetails() {
    //this.outline ="col-lg-6 col-md-6 col-xs-6 pb-3" 
  }
}
