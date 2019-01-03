import { Injectable } from '@angular/core';
import { IItem } from '../model/item';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { IComment } from '../model/comment';


@Injectable()
export class ItemService {
    host: String = "http://localhost:3000";
    constructor(private _http: HttpClient) {

    }
    getItems(): Observable<IItem[]> {
        return this._http.get<IItem[]>(this.host + "/svc/items");
    }
    getItemComments(itemId: String): Observable<IComment[]> {
        return this._http.get<IComment[]>(this.host + "/svc/items/" + itemId + "/comments/");
    }
    updateItem(item: Object): void {
        this._http.put(this.host + "/svc/items", item);
    }
    upVoteItem(itemId: String): Observable<IItem> {
        return this._http.put<IItem>(this.host + "/svc/items/upVote", { "id": itemId });
    }
}