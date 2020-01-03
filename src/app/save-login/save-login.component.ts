import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../shared/services/security/auth.service';

@Component({
  selector: 'app-save-login',
  template: ''
})
export class SaveLoginComponent implements OnInit {

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private _authSvc: AuthService) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      var user = params['user'];
      this._authSvc.saveThirdPartyLogin(user);
      this.router.navigate(['/']);
    });
  }

}
