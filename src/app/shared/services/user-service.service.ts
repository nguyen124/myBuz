import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IUser } from '../model/user';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private _http: HttpClient) { }

  register(user: IUser): Observable<any> {
    return this._http.post("/svc/signup", user);
  }

  user() {
    return this._http.get("/svc/user");
  }
}
