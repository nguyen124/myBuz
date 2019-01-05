import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  menus = ['Home', 'House', 'Design'];
  isLoggedIn: boolean = false;

  constructor(private _authSvc: AuthService) {
    _authSvc.loggingEventEmitter.subscribe(loggingStatus => {
      this.isLoggedIn = loggingStatus;
    })
  }


  ngOnInit() {
    if (localStorage.getItem('currentUser')) {
      this.isLoggedIn = true;
    }
  }
  logOut() {
    this._authSvc.logOut();
  }
  onloggingChanged(logging: boolean) {
    this.isLoggedIn = logging;
  }
}
