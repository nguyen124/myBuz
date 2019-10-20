import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../shared/services/security/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private _route: ActivatedRoute, private _auth: AuthService) {
    this._route.queryParams.subscribe(params => {
      var user = params["user"];
      this._auth.persist(user);
    });
  }

  ngOnInit() {
  }

}
