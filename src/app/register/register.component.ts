import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../shared/services/user-service.service';
import { SystemService } from '../shared/services/utils/system.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  error: any;
  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _userSvc: UserService,
    private _systemSvc: SystemService,
    private _translate: TranslateService) { }

  ngOnInit() {
    this.registerForm = this._fb.group({
      username: ['', [this._systemSvc.nonSpaceString, Validators.pattern(/^.{1,50}$/)]],
      email: ['', [Validators.email, this._systemSvc.nonSpaceString, Validators.pattern(/^.{5,50}$/)]],
      passwords: this._fb.group({
        password: ['', [Validators.pattern(/^.{6,50}$/)]],
        confirmPassword: ['', [Validators.pattern(/^.{6,50}$/)]]
      }, { validator: this.checkPasswords })
    });
  }

  checkPasswords(group: FormGroup) {
    var pass = group.get('password').value;
    var confirmPass = group.get("confirmPassword").value;
    return pass === confirmPass ? null : { matched: true }
  }

  get f() { return this.registerForm.controls; }

  checkError(field: string) {
    return this._systemSvc.checkError(this.registerForm, field, this.submitted);
  }

  checkGroupError(field: string) {
    return ((!this.registerForm.pristine && this.f.passwords['controls'][field].touched) || this.submitted)
      && this.f.passwords['controls'][field].errors
  }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      this.error = this._translate.instant("register.validate.invalidData");
      return;
    }
    this._userSvc.register(this.registerForm.value).subscribe(res => {
      this._router.navigate(["/login"]);
    }, err => {
      this.error = this._translate.instant(this._translate.instant(err.error));
    });
  }
}
