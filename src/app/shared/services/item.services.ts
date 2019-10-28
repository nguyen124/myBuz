import { Injectable } from '@angular/core';
import { IItem } from '../model/item';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { IComment } from '../model/comment';
import { LoggingService } from './system/logging.service';
import { AuthService } from './security/auth.service';

@Injectable()
export class ItemService {
    constructor(
        private _http: HttpClient,
        private _log: LoggingService,
        private _authSvc: AuthService) {
    }

    getItems(): Observable<IItem[]> {
        return this._http.get<IItem[]>("/svc/items");
    }

    getItemsOfUser(userId: String): any {
        return this._http.get<IItem[]>("/svc/users/" + userId + "/items");
    }

    getItemsOfCurrentUser(): any {
        return this._http.get<IItem[]>("/svc/currentuser/items");
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

    createItem(item: IItem): Observable<IItem> {
        return this._http.post<IItem>("/svc/current-user/items", item);
    }
}