import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IItem } from '../model/item';
import { IComment } from '../model/comment';

@Injectable({
  providedIn: 'root'
})
export class CommunicateService {

  // Observable navItem source
  private _itemSource = new BehaviorSubject<IItem>(null);
  private _commentSource = new BehaviorSubject<IComment[]>(null);
  // Observable navItem stream
  item$ = this._itemSource.asObservable();
  comments$ = this._commentSource.asObservable();
  // service command
  changeItem(item: IItem) {
    this._itemSource.next(item);
  }
  changeComments(replies: IComment[]) {
    this._commentSource.next(replies);
  }
  constructor() { }
}
