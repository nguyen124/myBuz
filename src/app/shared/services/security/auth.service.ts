import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../../model/user';
import { Observable } from 'rxjs';
import { SystemService } from '../utils/system.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn: boolean;
  user: IUser;
  constructor(private _http: HttpClient, private _systemSvc: SystemService) {
  }

  localLogIn(username: String, password: String): Observable<any> {
    var loginObs = this._http.post<any>('/svc/auth/local', { email: username, password: password });
    loginObs.subscribe(res => {
      this.loggedIn = true;
      this.user = res.user;
    }, err => {
      console.log(err);
    })
    return loginObs;
  }

  isLoggedIn() {
    return !!this._systemSvc.getCookie("myname.sid");
  }

  loginWithGoogle() {
    window.location.href = 'http://localhost:3000/svc/auth/google';
  };

  logout() {
    this._systemSvc.eraseCookie("myname.sid");
    return this._http.get("/svc/logout");
  }
}

