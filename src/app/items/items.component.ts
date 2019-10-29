import { Component, OnInit, Input } from '@angular/core';
import { FileUtils } from '../utils/FileUtils';
import { IItem } from '../shared/model/item';
import { ItemService } from '../shared/services/item.services';
import { ActivatedRoute } from '@angular/router';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  filterType: string;
  @Input()
  items: IItem[];
  selectedRadioValue: string = "all";
  showWaitingMessage = false;
  currentItem: IItem;

  constructor(private _itemService: ItemService, private _activeRoute: ActivatedRoute) {

  }

  ngOnInit() {
    this._activeRoute.queryParams.subscribe(queryParams => {
      this._itemService.getItems(queryParams).subscribe((items) => {
        this.items = items;
      });
    })
  }

  getFileType(item: any) {
    return FileUtils.getFileType(item.url);
  }

  getItemsCount(): number {
    return this.items.length;
  }

  getSeenItemsCount(): number {
    return 0;
  }

  getNotSeenItemsCount(): number {
    return 0;
  }

  getGlancedItemsCount(): number {
    return 0;
  }

  onRadioChanged(selectedRadioValue: string) {
    this.selectedRadioValue = selectedRadioValue;
  }

}
