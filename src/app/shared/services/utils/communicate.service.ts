import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IItem } from '../../model/item';
import { IComment } from '../../model/comment';

@Injectable({
  providedIn: 'root'
})
export class CommunicateService {
  // Observable navItem source
  private _newItemSource = new BehaviorSubject<IItem>(null);
  private _newUploadedItemSource = new BehaviorSubject<IItem>(null);
  private _newCommentSource = new BehaviorSubject<IComment>(null);
  private _newEdittingItem = new BehaviorSubject<IItem>(null);
  // Observable navItem stream
  currentItemInModal$ = this._newItemSource.asObservable();
  newUploadedItem$ = this._newUploadedItemSource.asObservable();
  newComment$ = this._newCommentSource.asObservable();
  newEdittingItem$ = this._newEdittingItem.asObservable();

  constructor() { }

  // service command
  changeItem(item: IItem) {
    this._newItemSource.next(item);
  }

  //on add new item
  uploadItem(item: IItem) {
    this._newUploadedItemSource.next(item);
  }

  changeComment(comment: IComment) {
    this._newCommentSource.next(comment);
  }

  updatingItem(item: IItem) {
    this._newEdittingItem.next(item);
  }
}
