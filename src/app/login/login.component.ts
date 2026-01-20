import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthService } from '../shared/services/security/auth.service';
import { SystemService } from '../shared/services/utils/system.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    standalone: false
})
export class LoginComponent implements OnInit {
  loginForm: UntypedFormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error: string;
  infoMessage: string;
  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _authSvc: AuthService,
    private _systemSvc: SystemService,
    private _translate: TranslateService) {
    this.returnUrl = this._activatedRoute.snapshot.queryParamMap.get('returnUrl') || '/';
  }

  ngOnInit() {
    this.loginForm = this._formBuilder.group({
      username: ['', [this._systemSvc.nonSpaceString, Validators.pattern(/^.{1,50}$/)]],
      password: ['', []]
    });
    this._activatedRoute.queryParams.subscribe(params => {
      this.infoMessage = params.message;
    });
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
      if (err.status === 500 || err.status === 401) {
        this.error = this._translate.instant(err.error);
      } else {
        this.error = this._translate.instant("login.validate.error");
      }
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
