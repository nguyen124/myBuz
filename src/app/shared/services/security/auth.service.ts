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
    var loginObs = this._http.post<any>('/svc/user/auth/local', { email: username, password: password });
    loginObs.subscribe(res => {
      this.loggedIn = true;
      this.user = res.user;
      localStorage.setItem("user", JSON.stringify(this.user));
    }, err => {
      console.log(err);
    })
    return loginObs;
  }

  isLoggedIn() {
    this.loggedIn = !!this._systemSvc.getCookie("myname.sid");
    return this.loggedIn;
  }

  loginWithGoogle() {
    window.location.href = 'https://us-central1-m2meme.cloudfunctions.net/app/svc/user/auth/google';
  };

  loginWithFacebook() {
    window.location.href = 'https://us-central1-m2meme.cloudfunctions.net/app/svc/user/auth/facebook';
  };

  saveThirdPartyLogin(user: string) {
    this.loggedIn = true;
    this.user = JSON.parse(user);
    localStorage.setItem("user", user);
  }

  logout() {
    this.loggedIn = false;
    this._systemSvc.eraseCookie("myname.sid");
    localStorage.removeItem("user");
    return this._http.get("/svc/user/logout");
  }
}

