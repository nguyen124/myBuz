import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IUser } from '../../model/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn: boolean = false;
  user: IUser;
  constructor(
    private _http: HttpClient) {
    if (localStorage.getItem('currentUser')) {
      this.loggedIn = true;
    }

  }

  localLogIn(username: String, password: String): Observable<any> {
    var loginObs = this._http.post<any>('/svc/auth/local', { email: username, password: password });
    loginObs.subscribe(res => {
      this.loggedIn = true;
      this.user = res.user;
      localStorage.setItem('currentUser', JSON.stringify(this.user));
    })
    return loginObs;
  }

  isLoggedIn() {
    return this.loggedIn;
  }

  loginWithGoogle() {
    window.location.href = 'http://localhost:3000/svc/auth/google';
  };

  logout() {
    localStorage.removeItem('currentUser');
    return this._http.get("/svc/logout");
  }
}

