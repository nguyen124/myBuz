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
        this._http.put( "/svc/items", item);
    }
    upVoteItem(itemId: String): Observable<IItem> {
        return this._http.put<IItem>("/svc/items/upVote", { "id": itemId });
    }
    downVoteItem(itemId: String): Observable<IItem> {
        return this._http.put<IItem>("/svc/items/downVote", { "id": itemId });
    }    
}