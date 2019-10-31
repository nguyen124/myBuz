import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
    return this._http.get("/svc/current-user");
  }

  updateUser(id: string, newInfo: any): Observable<IUser> {
    return this._http.put<IUser>("/svc/users/" + id, newInfo);
  }
}
