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
    if (_route.queryParams) {
      _route.queryParams.subscribe(params => {
        var param = params["user"];
        if (param) {
          var user = JSON.parse(param);
          _auth.persist(user);
        }
      });
    }

  }

  ngOnInit() {
    
  }

}
