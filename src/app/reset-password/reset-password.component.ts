import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { UserService } from '../shared/services/user-service.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SystemService } from '../shared/services/utils/system.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: UntypedFormGroup;
  submitted: boolean;
  error: String;
  params: any;
  constructor(
    private _fb: UntypedFormBuilder,
    private _userSvc: UserService,
    private _toastr: ToastrService,
    private _translate: TranslateService,
    private _systemSvc: SystemService,
    private _router: Router) { }

  ngOnInit() {
    this.resetPasswordForm = this._fb.group({
      email: ['', [this._systemSvc.nonSpaceString, Validators.email, Validators.pattern(/^.{5,50}$/)]]
    });
  }

  get f() {
    return this.resetPasswordForm.controls;
  }

  requestResetPassword() {
    this.submitted = true;
    if (this.resetPasswordForm.invalid) {
      return;
    }
    this.error = null;
    this._userSvc.requestResetPassword(this.f.email.value).subscribe(res => {
      if (!res) {
        this.error = this._translate.instant("login.email.validate.notExist");
      } else {
        this.error = null;
        this.params = {
          email: this.f.email.value
        }
        this._toastr.success(this._translate.instant("login.email.reset.success"));
        this._router.navigate(["resetPassword"], { queryParams: this.params });
      }
    }, err => {
      if (err.status === 500 || err.status === 401) {
        this.error = this._translate.instant(err.error);
      } else {
        this.error = this._translate.instant("login.email.reset.error");
      }
    });
  }
}
