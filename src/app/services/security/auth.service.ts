import { Injectable, EventEmitter, Output, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { IUser } from 'src/app/model/user';
import { LoggingService } from '../system/logging.service';


// The auth guard is used to prevent unauthenticated users from accessing restricted routes, in this example it's used in app.routing.ts to protect the home page route. For more information about angular 2 guards you can check out this post on the thoughtram blog.

// NOTE: While technically it's possible to bypass this client side authentication check by manually adding a 'currentUser' object to local storage using browser dev tools, this would only give access to the client side routes/components, it wouldn't give access to any real secure data from the server api because a valid authentication token (JWT) is required for this.

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: IUser = undefined;

  constructor(
    private _router: Router,
    private _http: HttpClient,
    private _log: LoggingService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  logOut() {
    localStorage.removeItem('currentUser');
    this.currentUser = undefined;
  }

  logIn(username: String, password: String, returnUrl: String) {

    return this._http.post<any>('/svc/users/auth', { email: username, password: password }).subscribe(user => {
      if (user && user.token) {
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        this._router.navigate([returnUrl]);
      }
    })
  }
}

