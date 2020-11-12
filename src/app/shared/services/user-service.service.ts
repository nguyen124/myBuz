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
    return this._http.post("/svc/users/register", user);
  }

  updateUser(id: string, newInfo: any): Observable<IUser> {
    return this._http.put<IUser>("/svc/users/" + id + "/update", newInfo);
  }

  requestResetPassword(email): Observable<boolean> {
    return this._http.post<boolean>("/svc/users/password/request-reset", { email: email });
  }

  resetPassword(obj): Observable<boolean> {
    return this._http.post<boolean>("/svc/users/password/reset", obj);
  }
}
