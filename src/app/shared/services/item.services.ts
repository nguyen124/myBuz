import { Injectable } from '@angular/core';
import { IItem } from '../model/item';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { IComment } from '../model/comment';

@Injectable({
    providedIn: 'root'
})
export class ItemService {
    constructor(
        private _http: HttpClient) {
    }

    getItems(params): Observable<IItem[]> {
        return this._http.get<IItem[]>("/svc/items", { params: params });
    }

    deleteItem(id: string): Observable<any> {
        return this._http.delete("/svc/items/" + id + "/delete");
    }

    updateItem(itemId: string, item: any): Observable<any> {
        return this._http.put("/svc/items/" + itemId + "/update", item);
    }

    getItemById(itemId: string): Observable<IItem> {
        return this._http.get<IItem>("/svc/items/" + itemId);
    }

    upview(itemId: string): Observable<IItem> {
        return this._http.post<IItem>("/svc/items/" + itemId + "/upview", {});
    }

    createItem(item): Observable<IItem> {
        return this._http.post<IItem>("/svc/items/create", item);
    }

    getCommentsOfItem(itemId: string, params): Observable<IComment[]> {
        return this._http.get<IComment[]>("/svc/items/" + itemId + "/comments", { params: params });
    }
}
