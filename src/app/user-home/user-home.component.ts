import { Component, OnInit, Inject } from '@angular/core';
import { UserService } from '../shared/services/user-service.service';
import { Router } from '@angular/router';
import { IUser } from '../shared/model/user';
import { AuthService } from '../shared/services/security/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SystemService } from '../shared/services/utils/system.service';
import { JQ_TOKEN } from '../shared/services/jQuery.service';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {
  user: IUser;
  uploadedFile: File = null;
  userForm: FormGroup
  submitted = false;

  constructor(
    private _userSvc: UserService,
    private _authSvc: AuthService,
    private _router: Router,
    private _fb: FormBuilder,
    private _systemSvc: SystemService,
    @Inject(JQ_TOKEN) private $: any) {
  }

  ngOnInit() {
    this.user = this._authSvc.user;
    this.userForm = this._fb.group({
      file: [''],
      username: ['', Validators.required]
    })
  }

  get f() { return this.userForm.controls; }

  checkError(field: string) {
    return this._systemSvc.checkError(this.userForm, field, this.submitted);
  }

  chooseFile() {
    var that = this;
    this.$("#fileUpload").bind('change', function (event) {
      if (event && event.currentTarget && event.currentTarget.files) {
        this.uploadedFile = <File>event.currentTarget.files.item(0);
        if (this.uploadedFile) {
          var reader = new FileReader();
          reader.onload = function (e) {
            var ava = that.$("#avatar");
            if (ava) {
              ava.attr('src', e.target["result"]);
            }
          }
          reader.readAsDataURL(this.uploadedFile);
        }
      }
    }).click();
  }
}
