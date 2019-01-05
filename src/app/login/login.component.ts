import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
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

  constructor(private _formBuilder: FormBuilder, private _route: ActivatedRoute, private _router: Router, private _authService: AuthService) {

  }

  ngOnInit() {
    this.loginForm = this._formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
    // reset login status
    this._authService.logOut();
    // get return url from route parameters or default to home 
    this.returnUrl = this._route.snapshot.queryParamMap['returnUrl'] || '/';
  }

  // convenience getter fro easy access to from fields
  get f() {
    return this.loginForm.controls;
  }

  login(event: any) {
    event.preventDefault();
    this.submitted = true;
    // stop here if form is invalid    
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this._authService.logIn(this.f.username.value, this.f.password.value);
    this._router.navigate([this.returnUrl]);
    //console.log(form.value.username);
  }
}
