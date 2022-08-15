import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IItem } from '../../model/item';
import { IComment } from '../../model/comment';

@Injectable({
  providedIn: 'root'
})
export class CommunicateService {

  itemsActive: boolean = true;
  hiringActive: boolean = false;
  saleActive: boolean = false;

  // Observable navItem source
  private _newItemSource = new BehaviorSubject<IItem>(null);
  private _newUploadedItemSource = new BehaviorSubject<IItem>(null);
  private _newCommentSource = new BehaviorSubject<IComment>(null);
  // Observable navItem stream
  currentItemInModal$ = this._newItemSource.asObservable();
  newUploadedItem$ = this._newUploadedItemSource.asObservable();
  newComment$ = this._newCommentSource.asObservable();

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
    this._newCommentSource.next(null);// trick to clear out comment being sending again
  }

  setFlag(flag1: boolean, flag2: boolean, flag3: boolean) {
    this.itemsActive = flag1;
    this.hiringActive = flag2;
    this.saleActive = flag3;
  }
}
