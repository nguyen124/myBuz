import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';
import { AuthService } from '../shared/services/security/auth.service';

//import { Auth0Service } from '../shared/services/security/auth0.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],

})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  result: any;
  constructor(
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _authSvc: AuthService) {
    this.returnUrl = this._route.snapshot.queryParamMap.get('returnUrl') || '/';
  }

  ngOnInit() {
    this.loginForm = this._formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
    // reset login status
    this._authSvc.logout();
  }

  // convenience getter fro easy access to from fields
  get f() {
    return this.loginForm.controls;
  }

  login() {
    //event.preventDefault();
    this.submitted = true;
    // stop here if form is invalid    
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    //this._authService.logIn(this.f.username.value, this.f.password.value, this.returnUrl);
    this._authSvc.localLogIn(this.f.username.value, this.f.password.value).subscribe(res => {
      this.result = res;
      if (this.result.status == "LOGIN_DONE") {
        this._authSvc.setLoggedIn(true);
        this._authSvc.setUser(this.result.user);
        this._router.navigate(["/"])
      }
    });
  }

  loginWithGoogle() {
    this._authSvc.loginWithGoogle(this.returnUrl);
  }
}
