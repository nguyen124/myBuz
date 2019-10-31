import { Component, OnInit } from '@angular/core';
import { IItem } from '../shared/model/item';
import { UserService } from '../shared/services/user-service.service';

@Component({
  selector: 'app-my-items',
  templateUrl: './my-items.component.html',
  styleUrls: ['./my-items.component.css']
})
export class MyItemsComponent implements OnInit {
  items: IItem[];

  constructor(private _usersvc: UserService) {
  }

  ngOnInit() {
    this._usersvc.getMyItems().subscribe((items: IItem[]) => {
      this.items = items;
    });
  }
}
