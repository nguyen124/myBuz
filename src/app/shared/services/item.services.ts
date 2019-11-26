import { Injectable } from '@angular/core';
import { IItem } from '../model/item';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class ItemService {
    constructor(
        private _http: HttpClient) {
    }

    getItems(params): Observable<IItem[]> {
        return this._http.get<IItem[]>("/svc/items", { params: params });
    }

    deleteItem(id: string): Observable<any> {
        return this._http.delete("/svc/items/" + id);
    }

    updateItem(item: object): void {
        this._http.put("/svc/items", item);
    }

    createItem(item): Observable<IItem> {
        return this._http.post<IItem>("/svc/current-user/items", item);
    }

    getItemById(itemId): Observable<IItem> {
        return this._http.get<IItem>("/svc/items/" + itemId);
    }
}