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
        return this._http.get<IItem[]>("http://localhost:3000/svc/items");
    }
    getItemComments(itemId: String): Observable<IComment[]> {
        return this._http.get<IComment[]>("http://localhost:3000/svc/items/" + itemId + "/comments/");
    }
}