import { Injectable } from '@angular/core';
import { IItem } from '../model/item';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { IComment } from '../model/comment';
import { AuthService } from './security/auth.service';

@Injectable()
export class ItemService {
    constructor(
        private _http: HttpClient) {
    }

    getItems(params): Observable<IItem[]> {
        return this._http.get<IItem[]>("/svc/items", { params: params });
    }

    getItemsOfUser(userId: String): any {
        return this._http.get<IItem[]>("/svc/users/" + userId + "/items");
    }

    getCommentsOfItem(itemId: string): Observable<IComment[]> {
        return this._http.get<IComment[]>("/svc/items/" + itemId + "/comments");
    }

    updateItem(item: Object): void {
        this._http.put("/svc/items", item);
    }

    getItemUserLog(itemId: string): any {
        return this._http.get<boolean>("/svc/items/" + itemId + "/users/");
    }

    createItem(item): Observable<IItem> {
        return this._http.post<IItem>("/svc/current-user/items", item);
    }
}