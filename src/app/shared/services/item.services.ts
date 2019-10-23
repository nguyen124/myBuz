import { Injectable } from '@angular/core';
import { IItem } from '../model/item';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { IComment } from '../model/comment';
import { LoggingService } from './system/logging.service';
import { AuthService } from './security/auth.service';

@Injectable()
export class ItemService {
    constructor(
        private _http: HttpClient,
        private _log: LoggingService,
        private _authSvc: AuthService) {
    }

    hasVoted(itemId: string): Observable<number> {
        return this._http.get<number>("/svc/current-user/has-voted" + itemId);
    }

    upvote(itemId: string): Observable<number> {
        return this._http.put<number>("/svc/current-user/upvote", { itemId: itemId });
    }

    unvote(itemId: String): Observable<number> {
        return this._http.put<number>("/svc/current-user/unvote", { itemId: itemId });
    }

    downvote(itemId: string): Observable<number> {
        return this._http.put<number>("/svc/current-user/downvote", { itemId: itemId });
    }

    getItems(): Observable<IItem[]> {
        return this._http.get<IItem[]>("/svc/items");
    }

    getItemsOfUser(userId: String): any {
        return this._http.get<IItem[]>("/svc/users/" + userId + "/items");
    }

    getItemsOfCurrentUser(): any {
        return this._http.get<IItem[]>("/svc/currentuser/items");
    }

    getCommentsOfItem(itemId: string): Observable<IComment[]> {
        return this._http.get<IComment[]>("/svc/items/" + itemId + "/comments");
    }

    addCommentToItem(itemId: string, content: string): Observable<any> {
        return this._http.post<any>('/svc/items/comment', {
            itemId: itemId,
            content: content,
            modifiedDate: (new Date()).getTime(),
            writtenBy: {
                userName: this._authSvc.user.userName,
                avatar: this._authSvc.user.avatar
            }
        });
    }

    addVoiceCommentToItem(itemId: string, url: any): any {
        return this._http.post<any>('/svc/items/comment', {
            itemId: itemId,
            url: url,
            modifiedDate: (new Date()).getTime(),
            writtenBy: {
                userName: this._authSvc.user.userName,
                avatar: this._authSvc.user.avatar
            }
        });

    }

    updateItem(item: Object): void {
        this._http.put("/svc/items", item);
    }

    getItemUserLog(itemId: string): any {
        return this._http.get<boolean>("/svc/items/" + itemId + "/users/");
    }

    createItem(item: IItem) {
        return this._http.post("/svc/items", item);
    }
}