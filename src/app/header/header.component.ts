import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../shared/services/security/auth.service';
import { IUser } from '../shared/model/user';
import { CommunicateService } from '../shared/services/utils/communicate.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  menus = [];  

  constructor(public _authSvc: AuthService, private _commSvc: CommunicateService) {

  }

  ngOnInit() { 
  }

  logOut() {
    this._authSvc.logOut();
  }

  ngOnDestroy() {

  }
}
