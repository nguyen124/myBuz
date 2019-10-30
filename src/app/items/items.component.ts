import { Component, OnInit, Input } from '@angular/core';
import { IItem } from '../shared/model/item';
import { ItemService } from '../shared/services/item.services';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  @Input()
  items: IItem[];
  currentPage = 0;
  constructor(private _itemService: ItemService, private _activeRoute: ActivatedRoute) {

  }

  ngOnInit() {
    this._activeRoute.queryParams.subscribe(queryParams => {
      var page = this._activeRoute.snapshot.queryParams["page"];
      this.currentPage = page ? +page : 0;
      this._itemService.getItems(queryParams).subscribe((newItems: IItem[]) => {
        if (!this.items) {
          this.items = newItems;
        } else {
          for (var item of newItems) {
            this.items.push(item);
          }
        }
      });
    });
  }

  onClickNext() {
    this.currentPage++;
  }

  increaseValue() {
    var value = parseInt(document.getElementById('number').value, 10);
    value = isNaN(value) ? 0 : value;
    value++;
    document.getElementById('number').value = value;
  }

  decreaseValue() {
    var value = parseInt(document.getElementById('number').value, 10);
    value = isNaN(value) ? 0 : value;
    value < 1 ? value = 1 : '';
    value--;
    document.getElementById('number').value = value;
  }
}
