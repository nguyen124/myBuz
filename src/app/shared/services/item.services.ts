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

    // updateItem(item: any): void {
    //     this._http.put("/svc/item._id/items", item);
    // }

    createItem(item): Observable<IItem> {
        return this._http.post<IItem>("/svc/items/create", item);
    }

    getItemById(itemId): Observable<IItem> {
        return this._http.get<IItem>("/svc/items/" + itemId);
    }

    getCommentsOfItem(itemId: string, params): Observable<IComment[]> {
      return this._http.get<IComment[]>("/svc/items/" + itemId + "/comments", { params: params });
  }
}
