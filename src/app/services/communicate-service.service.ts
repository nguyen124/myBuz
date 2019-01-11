import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IItem } from '../model/item';

@Injectable({
  providedIn: 'root'
})
export class CommunicateService {
  // Observable navItem source
  private _itemSource = new BehaviorSubject<IItem>(null);
  // Observable navItem stream
  item$ = this._itemSource.asObservable();
  // service command
  changeItem(item: IItem) {
    this._itemSource.next(item);
  }
  constructor() { }
}
