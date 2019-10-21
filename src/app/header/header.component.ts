import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../shared/services/security/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  menus = [];

  constructor(public _authSvc: AuthService, private _router: Router) {

  }

  ngOnInit() {
  }

  logout() {
    this._authSvc.logout().subscribe(
      data => { console.log(data); this._router.navigate(["/"]) },
      err => { console.log(err) }
    );
  }

  ngOnDestroy() {

  }
}
