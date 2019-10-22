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
  }

  get f() {
    return this.loginForm.controls;
  }

  login() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this._authSvc.localLogIn(this.f.username.value, this.f.password.value).subscribe(res => {
      this.result = res;
      if (this.result.status == "LOGIN_DONE") {
        this._router.navigate([this.returnUrl])
      }
    });
  }

  loginWithGoogle() {
    this._authSvc.loginWithGoogle();
  }
}
