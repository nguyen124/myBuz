import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { IUser } from '../../model/user';
import { CommunicateService } from '../utils/communicate.service';

// The auth guard is used to prevent unauthenticated users from accessing restricted routes, in this example it's used in app.routing.ts to protect the home page route. For more information about angular 2 guards you can check out this post on the thoughtram blog.

// NOTE: While technically it's possible to bypass this client side authentication check by manually adding a 'currentUser' object to local storage using browser dev tools, this would only give access to the client side routes/components, it wouldn't give access to any real secure data from the server api because a valid authentication token (JWT) is required for this.

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: IUser = undefined;
  jwtToken: String = undefined;

  constructor(
    private _router: Router,
    private _http: HttpClient,
    private _commSvc: CommunicateService) {
    const jwtToken = localStorage.getItem('jwtToken');
    if (jwtToken) {
      this.setNewUser(JSON.parse(localStorage.getItem('currentUser')));
    }
  }

  setNewUser(user) {
    this.currentUser = user;
    this._commSvc.changeUser(user);
  }

  logOut() {
    this.setNewUser(undefined);
    this.jwtToken = undefined;

    localStorage.removeItem('jwtToken');
  }

  logIn(username: String, password: String, returnUrl: String) {

    return this._http.post<any>('/svc/users/auth', { email: username, password: password }).subscribe(res => {
      if (res && res.jwtToken) {
        let user = {
          _id: res._id,
          avatar: res.avatar,
          userName: res.userName,
          noOfFollowers: res.noOfFollowers,
          rank: res.rank,
          joinedDate: res.joinedDate,
          status: res.status
        };
        this.jwtToken = res.jwtToken;
        this.setNewUser(user);
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        localStorage.setItem('jwtToken', res.jwtToken);
        this._router.navigate([returnUrl]);
      }
    })
  }

  loginWithGoogle() {
    window.open('http://localhost:3000/svc/users/google/auth', "mywindow", "location=1,status=1,scrollbars=1, width=800,height=800");
    let listener = window.addEventListener('message', (message) => {
      console.log(message);
    });
  };
}

