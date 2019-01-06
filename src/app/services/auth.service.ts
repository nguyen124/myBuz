import { Injectable, EventEmitter, Output, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';


// The auth guard is used to prevent unauthenticated users from accessing restricted routes, in this example it's used in app.routing.ts to protect the home page route. For more information about angular 2 guards you can check out this post on the thoughtram blog.

// NOTE: While technically it's possible to bypass this client side authentication check by manually adding a 'currentUser' object to local storage using browser dev tools, this would only give access to the client side routes/components, it wouldn't give access to any real secure data from the server api because a valid authentication token (JWT) is required for this.

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn: boolean;
  @Output()
  loggingEventEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private _http: HttpClient) { }

  logOut() {
    localStorage.removeItem('currentUser');
    this.isLoggedIn = false;
    this.loggingEventEmitter.emit(this.isLoggedIn);
  }
  
  get f() {
    return this.isLoggedIn;
  }

  logIn(username: String, password: String) {
    return this._http.post<any>('/svc/users/auth', { email: username, password: password }).subscribe(user => {
      if (user && user.token) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.isLoggedIn = true;
        this.loggingEventEmitter.emit(this.isLoggedIn);
      }
    })
  }
}

