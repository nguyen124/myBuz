import { Injectable } from '@angular/core';
import { IItem } from '../model/item';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';


@Injectable()
export class ItemService {
    constructor(private _http: HttpClient) {

    }
    getItems(): Observable<IItem[]> {
        return this._http.get<IItem[]>("http://localhost:3000/svc/items");       
    }
}