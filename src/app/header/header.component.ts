import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/security/auth.service';
import { IUser } from '../model/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  menus = [];
  currentUser: IUser = undefined;

  constructor(private _authSvc: AuthService) {

  }

  ngOnInit() {
    this.currentUser = this._authSvc.currentUser;
  }

  logOut() {
    this._authSvc.logOut();
  }

}
