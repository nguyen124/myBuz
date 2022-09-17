import { Component, OnInit } from '@angular/core';
import { IItem } from '../shared/model/item';
import { ItemService } from '../shared/services/item.services';

@Component({
  selector: 'app-top-panel',
  templateUrl: './top-panel.component.html',
  styleUrls: ['./top-panel.component.css']
})
export class TopPanelComponent implements OnInit {
  item: IItem;
  perPage: number = 4;
  files = [];
  constructor(private _itemService: ItemService) { }

  ngOnInit(): void {
    this.perPage = Math.floor(window.screen.width / 390);
    if (this.perPage === 0) { this.perPage = 1 };
    this._itemService.getSpecialItem().subscribe((newItem: IItem) => {
      if (newItem) {
        this.item = newItem;
        let L = this.item.files.length;
        if (this.perPage < L) {
          this.files = this.item.files.slice(0, this.perPage);
          let that = this;
          setInterval(() => {
            that.rotate(this.item.files, this.perPage);
            this.files = this.item.files.slice(0, this.perPage);
          }, 3000);
        } else {
          this.files = this.item.files;
        }
      }
    });
  }

  public rotate(arr: any[], k: number) {
    k %= arr.length;
    this.reverse(arr, 0, arr.length - 1);
    this.reverse(arr, 0, k - 1);
    this.reverse(arr, k, arr.length - 1);
  }

  public reverse(arr: any[], start: number, end: number) {
    while (start < end) {
      [arr[start], arr[end]] = [arr[end], arr[start]]
      start++;
      end--;
    }
  }
}
