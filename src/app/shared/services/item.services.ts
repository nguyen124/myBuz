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
        return this._http.get<IItem[]>("/svc/business", { params: params });
    }

    getRandomItems(): Observable<IItem[]> {
        return this._http.get<IItem[]>("/svc/business/random", { });
    }

    getSpecialItem(): Observable<IItem> {
        return this._http.get<IItem>("/svc/business/special", { });
    }

    getMyItems(params): Observable<IItem[]> {
        return this._http.get<IItem[]>("/svc/business/user", { params: params });
    }

    // deleteItem(id: string): Observable<any> {
    //     return this._http.delete("/svc/business/" + id + "/delete");
    // }

    deleteItem(id: string): Observable<any> {
        return this._http.put("/svc/business/" + id + "/fakedelete", {});
    }

    deleteRefundItem(id: string): Observable<any> {
        return this._http.put("/svc/business/" + id + "/deleteRefund", {});
    }

    updateItem(itemId: string, item: any): Observable<any> {
        return this._http.put("/svc/business/" + itemId + "/update", item);
    }

    getItemById(itemId: string): Observable<IItem> {
        return this._http.get<IItem>("/svc/business/" + itemId);
    }

    upview(itemId: string): Observable<IItem> {
        return this._http.post<IItem>("/svc/business/" + itemId + "/upview", {});
    }

    createItem(item): Observable<IItem> {
        return this._http.post<IItem>("/svc/business/create", item);
    }

    getCommentsOfItem(itemId: string, params): Observable<IComment[]> {
        return this._http.get<IComment[]>("/svc/business/" + itemId + "/comments", { params: params });
    }

    checkExistingFreePost(): Observable<boolean> {
        return this._http.get<boolean>("/svc/business/checkExistingFreePost");
    }
}
