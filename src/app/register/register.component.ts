import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
      username: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
      confirm_password: [null, Validators.required]
    })
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid || this.registerForm.controls.password.value != this.registerForm.controls.confirm_password.value) {
      this.result = { error: "Invalid Fields!" };
      return;
    }
    this.loading = true;
    this._userService.register(this.registerForm.value).subscribe(res => {
      this.loading = false;
      this.result = res;
      if (this.result.status == "REGISTER_DONE") {
        this._router.navigate(["/login"]);
      }
    });
  }
}
