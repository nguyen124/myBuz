import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { UserService } from '../shared/services/user-service.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { SystemService } from '../shared/services/utils/system.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-reset-password-form',
  templateUrl: './reset-password-form.component.html',
  styleUrls: ['./reset-password-form.component.css']
})
export class ResetPasswordFormComponent implements OnInit {

  resetPasswordForm: FormGroup;
  submitted: boolean;
  error: String;

  constructor(
    private _fb: FormBuilder,
    private _userSvc: UserService,
    private _toastr: ToastrService,
    private _router: Router,
    private _systemSvc: SystemService,
    private _translate: TranslateService,
    private _activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.resetPasswordForm = this._fb.group({
      email: new FormControl({ value: this._activatedRoute.snapshot.queryParams.email, disabled: true }, Validators.required),
      resetPasscode: ['', Validators.required],
      passwords: this._fb.group({
        password: ['', [Validators.pattern(/^.{6,50}$/)]],
        confirmPassword: ['', [Validators.pattern(/^.{6,50}$/)]]
      }, { validator: this.checkPasswords })
    });
  }

  get f() {
    return this.resetPasswordForm.controls;
  }

  checkError(field: string) {
    return this._systemSvc.checkError(this.resetPasswordForm, field, this.submitted);
  }

  checkGroupError(field: string) {
    return ((!this.resetPasswordForm.pristine && this.f.passwords['controls'][field].touched) || this.submitted)
      && this.f.passwords['controls'][field].errors
  }

  checkPasswords(group: FormGroup) {
    var pass = group.get('password').value;
    var confirmPass = group.get("confirmPassword").value;
    return pass === confirmPass ? null : { matched: true }
  }

  updatePassword() {
    var obj = {
      email: this.f.email.value,
      resetPasscode: this.f.resetPasscode.value,
      password: this.f.passwords["controls"].password.value,
      confirmPassword: this.f.passwords["controls"].confirmPassword.value
    }
    this._userSvc.resetPassword(obj).subscribe(res => {
      if (!res) {
        this.error = this._translate.instant("login.password.reset.error");
      } else {
        this.error = null;
        this._toastr.success(this._translate.instant("login.password.reset.success"));
        this._router.navigate(["/login"]);
      }
    }, err => {
      this.error = err.error;
    });
  }
}
