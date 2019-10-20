import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { IUser } from '../../model/user';

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


  logOut() {
    this.user = null;
    localStorage.removeItem('currentUser');
  }

  logIn(username: String, password: String, returnUrl: String) {
    return this._http.post<any>('/svc/users/auth', { email: username, password: password }).subscribe(res => {
      if (res) {
        this.persist(res);
        this._router.navigate([returnUrl]);
      }
    })
  }

  isLoggedIn() {
    return this.user && this.user.accessToken;
  }

  persist(res: any) {
    this.user = {
      _id: res._id,
      email: res.email,
      avatar: res.avatar,
      userName: res.userName,
      familyName: res.familyName,
      givenName: res.givenName,
      joinedDate: res.joinedDate,
      accessToken: res.accessToken,
      noOfFollowers: res.noOfFollowers,
      rank: res.rank,
      status: res.status
    };
    localStorage.setItem('currentUser', JSON.stringify(this.user));
  }

  loginWithGoogle(returnUrl: String) {
    window.location.href = 'http://localhost:3000/svc/users/google/auth';
  };
}

