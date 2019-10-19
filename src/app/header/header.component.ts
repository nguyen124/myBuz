import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../shared/services/security/auth.service';
import { IUser } from '../shared/model/user';
import { Subscription } from 'rxjs';
import { CommunicateService } from '../shared/services/utils/communicate.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  menus = [];
  currentUser: IUser = undefined;
  subscription: Subscription;

  constructor(private _authSvc: AuthService, private _commSvc: CommunicateService) {

  }

  ngOnInit() {
    this.subscription = this._commSvc.currentUser$.subscribe((user: IUser) => {
      this.currentUser = user;
    });
  }

  logOut() {
    this._authSvc.logOut();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
