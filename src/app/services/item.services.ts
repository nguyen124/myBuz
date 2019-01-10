import { Injectable } from '@angular/core';
import { IItem } from '../model/item';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { IComment } from '../model/comment';


@Injectable()
export class ItemService {

    constructor(private _http: HttpClient) {

    }
    getItems(): Observable<IItem[]> {
        return this._http.get<IItem[]>("/svc/items");
    }
    getItemComments(itemId: String): Observable<IComment[]> {
        return this._http.get<IComment[]>("/svc/items/" + itemId + "/comments/");
    }
    updateItem(item: Object): void {
        this._http.put("/svc/items", item);
    }
    upVoteItem(itemId: String, userId: String): Observable<any> {
        return this._http.put("/svc/items/upVote", { "itemId": itemId, "userId": userId });
    }

    unUpVoteItem(itemId: String, userId: String): any {
        return this._http.put<IItem>("/svc/items/unUpVote", { "itemId": itemId, "userId": userId });
    }

    unDownVoteItem(itemId: String, userId: String): any {
        return this._http.put<IItem>("/svc/items/unDownVote", { "itemId": itemId, "userId": userId });
    }

    downVoteItem(itemId: String, userId: String): Observable<IItem> {
        return this._http.put<IItem>("/svc/items/downVote", { "itemId": itemId, "userId": userId });
    }
    getItemUserLog(itemId: string, userId: string): any {
        return this._http.get<boolean>("/svc/items/" + itemId + "/users/" + userId);
    }
}