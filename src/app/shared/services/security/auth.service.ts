import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { IUser } from '../../model/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn: boolean;
  user: IUser;
  constructor(
    private _router: Router,
    private _http: HttpClient) {
    const currentUser = localStorage.getItem('currentUser');
    this.user = JSON.parse(currentUser);
  }

  // logIn(username: String, password: String, returnUrl: String) {
  //   return this._http.post<any>('/svc/users/auth', { email: username, password: password }).subscribe(res => {
  //     if (res) {
  //       this.persist(res);
  //       this._router.navigate([returnUrl]);
  //     }
  //   })
  // }

  localLogIn(username: String, password: String): Observable<any> {
    return this._http.post<any>('/svc/auth/local', { email: username, password: password }, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  isLoggedIn() {
    return this.loggedIn;
  }

  setLoggedIn(loggedIn) {
    this.loggedIn = loggedIn;
  }

  setUser(user) {
    this.user = user;
  }
  // persist(res: any) {
  //   this.user = {
  //     _id: res._id,
  //     email: res.email,
  //     avatar: res.avatar,
  //     userName: res.userName,
  //     familyName: res.familyName,
  //     givenName: res.givenName,
  //     joinedDate: res.joinedDate,
  //     accessToken: res.accessToken,
  //     noOfFollowers: res.noOfFollowers,
  //     rank: res.rank,
  //     status: res.status
  //   };
  //   localStorage.setItem('currentUser', JSON.stringify(this.user));
  // }

  loginWithGoogle(returnUrl: String) {
    window.location.href = 'http://localhost:3000/svc/auth/google';
  };

  logout() {
    return this._http.get("/svc/logout", {
      observe: "body",
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    })
  }
}

