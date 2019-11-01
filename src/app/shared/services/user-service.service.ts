import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../model/user';
import { Observable } from 'rxjs';
import { IItem } from '../model/item';
import { AuthService } from './security/auth.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private _http: HttpClient, private _authSvc: AuthService) { }

  register(user: IUser): Observable<any> {
    return this._http.post("/svc/user/register", user);
  }

  updateUser(id: string, newInfo: any): Observable<IUser> {
    return this._http.put<IUser>("/svc/users/" + id, newInfo);
  }

  getMyItems(): Observable<IItem[]> {
    return this._http.get<IItem[]>("/svc/items?createdBy=" + this._authSvc.user._id);
  }
}
