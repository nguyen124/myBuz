import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IItem } from '../../model/item';
import { IComment } from '../../model/comment';
import { IUser } from '../../model/user';

@Injectable({
  providedIn: 'root'
})
export class CommunicateService {


  // Observable navItem source
  private _newItemSource = new BehaviorSubject<IItem>(null);
  private _newCommentSource = new BehaviorSubject<IComment>(null);
  private _currentCommentSource = new BehaviorSubject<IComment>(null);
  private _newReplySource = new BehaviorSubject<IComment>(null);
  private _currentUser = new BehaviorSubject<IUser>(null);

  // Observable navItem stream
  currentItemInModal$ = this._newItemSource.asObservable();
  newComment$ = this._newCommentSource.asObservable();
  currentComment$ = this._currentCommentSource.asObservable();
  newReply$ = this._newReplySource.asObservable();
  currentUser$ = this._currentUser.asObservable();

  // service command
  changeItem(item: IItem) {
    this._newItemSource.next(item);
  }

  changeComment(comment: IComment) {
    this._newCommentSource.next(comment);
  }

  changeUser(user: IUser) {
    this._currentUser.next(user);
  }

  onClickReply(comment: IComment) {
    this._currentCommentSource.next(comment);
  }

  onAddNewReply(reply: IComment) {
    this._newReplySource.next(reply);
  }

  constructor() { }
}
