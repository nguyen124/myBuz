import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/services/user-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {

  constructor(private _userSvc: UserService, private _router: Router) {

  }

  ngOnInit() {
    this._userSvc.user().subscribe(
      res => {
        console.log(JSON.stringify(res));
      },
      err => this._router.navigate(["/login"]));
  }

}
