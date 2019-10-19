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
  constructor(private _formBuilder: FormBuilder, private _route: ActivatedRoute, private _authService: AuthService) {
    this.returnUrl = this._route.snapshot.queryParamMap.get('returnUrl') || '/';
  }

  ngOnInit() {
    this.loginForm = this._formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
    // reset login status
    this._authService.logOut();
    // get return url from route parameters or default to home 

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
    this._authService.logIn(this.f.username.value, this.f.password.value, this.returnUrl);
  }

  // loginWithGoogle() {
  //   this._auth0Service.logIn();
  // }
}
