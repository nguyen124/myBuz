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
    this.user = JSON.parse(localStorage.getItem("user"));
  }

  localLogIn(username: string, password: string): Observable<any> {
    var loginObs = this._http.post<any>('/svc/users/local-auth', { email: username, password: password });
    loginObs.subscribe(res => {
      this.loggedIn = true;
      this.user = res.user;
      localStorage.setItem("user", JSON.stringify(this.user));
    }, err => {

    })
    return loginObs;
  }

  isLoggedIn() {
    this.loggedIn = !!this._systemSvc.getCookie("__session");
    return this.loggedIn;
  }

  loginWithGoogle() {
    window.location.href = '/svc/users/google-auth';
  };

  loginWithFacebook() {
    window.location.href = '/svc/users/facebook-auth';
  };

  saveThirdPartyLogin(user: string) {
    this.loggedIn = true;
    this.user = JSON.parse(user);
    localStorage.setItem("user", user);
  }

  logout() {
    this.loggedIn = false;
    this._systemSvc.eraseCookie("__session");
    localStorage.removeItem("user");
    return this._http.post("/svc/users/logout", {});
  }
}

