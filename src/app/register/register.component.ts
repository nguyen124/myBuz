import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UserService } from '../shared/services/user-service.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  result: any;
  constructor(private _formBuilder: FormBuilder, private _router: Router, private _userService: UserService) { }

  ngOnInit() {
    this.registerForm = this._formBuilder.group({
      username: ['', [Validators.required, this.nonSpaceString]],
      email: ['', [Validators.required, Validators.email]],
      passwords: this._formBuilder.group({
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]]
      }, { validator: this.checkPasswords })
    });
  }

  nonSpaceString(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  checkPasswords(group: FormGroup) {
    var pass = group.get('password').value;
    var confirmPass = group.get("confirmPassword").value;
    return pass === confirmPass ? null : { matched: true }
  }

  get f() { return this.registerForm.controls; }

  checkError(field) {
    return ((!this.registerForm.pristine && this.f[field].touched) || this.submitted)
      && this.f[field].errors
  }

  checkGroupError(field) {
    return ((!this.registerForm.pristine && this.f.passwords['controls'][field].touched) || this.submitted)
      && this.f.passwords['controls'][field].errors
  }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      this.result = { error: "Invalid Fields!" };
      return;
    }
    this.loading = true;
    this._userService.register(this.registerForm.value).subscribe(res => {
      this.loading = false;
      this.result = res;
      if (this.result.status == "REGISTER_DONE") {
        this._router.navigate(["/"]);
      }
    });
  }
}
