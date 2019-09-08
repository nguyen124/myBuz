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
  currentItem: IItem;
  hasVoted: boolean = false;

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
    return 0;// this.items.filter(e => e.seen === "seen").length;
  }

  getNotSeenItemsCount(): number {
    return 0; //this.items.filter(e => e.viewed === "notSeen").length;
  }

  getGlancedItemsCount(): number {
    return 0;// this.items.filter(e => e.viewed === "glanced").length;
  }

  onRadioChanged(selectedRadioValue: string) {
    this.selectedRadioValue = selectedRadioValue;
  }

}
