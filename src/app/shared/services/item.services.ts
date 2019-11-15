import { Injectable } from '@angular/core';
import { IItem } from '../model/item';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from './security/auth.service';

@Injectable()
export class ItemService {
    constructor(
        private _http: HttpClient,
        private _authSvc: AuthService) {
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

    getItemUserLog(itemId: string): any {
        return this._http.get<boolean>("/svc/items/" + itemId + "/users/");
    }

    createItem(item): Observable<IItem> {
        return this._http.post<IItem>("/svc/current-user/items", item);
    }

    getMyItems(page): Observable<IItem[]> {
        return this._http.get<IItem[]>("/svc/items?createdBy=" + this._authSvc.user._id + "&page=" + page);
    }
}