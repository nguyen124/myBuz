import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../shared/services/security/auth.service';
import { SystemService } from '../shared/services/utils/system.service';

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
  error: string;
  constructor(
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _authSvc: AuthService,
    private _systemSvc: SystemService) {
    this.returnUrl = this._route.snapshot.queryParamMap.get('returnUrl') || '/';
  }

  ngOnInit() {
    this.loginForm = this._formBuilder.group({
      username: ['', [this._systemSvc.nonSpaceString, Validators.pattern(/^.{1,50}$/)]],
      password: ['', [Validators.required]]
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
      this._router.navigate([this.returnUrl])
    }, err => {
      this.error = err.statusText;
    });
  }

  loginWithGoogle($event) {
    $event.preventDefault();
    this._authSvc.loginWithGoogle();
  }

  loginWithFacebook($event) {
    $event.preventDefault();
    this._authSvc.loginWithFacebook();
  }
}
