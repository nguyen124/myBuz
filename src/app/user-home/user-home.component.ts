import { Component, OnInit, Inject } from '@angular/core';
import { UserService } from '../shared/services/user-service.service';
import { Router } from '@angular/router';
import { IUser } from '../shared/model/user';
import { AuthService } from '../shared/services/security/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SystemService } from '../shared/services/utils/system.service';
import { JQ_TOKEN } from '../shared/services/jQuery.service';
import { HttpEventType } from '@angular/common/http';
import { LoggingService } from '../shared/services/system/logging.service';

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
    private _log: LoggingService,
    @Inject(JQ_TOKEN) private $: any) {
  }

  ngOnInit() {
    this.user = this._authSvc.user;
    this.user.gender = this.user.gender || '';
    this.user.nationality = this.user.nationality || '';
    this.user.dob = this.user.dob || '';
    this.initValue();
  }

  initValue() {
    this.uploadedFile = null;
    this.$("#avatar").attr("src", this.user.avatar);
    this.userForm = this._fb.group({
      file: [null],
      username: [this.user.username, [Validators.required, this._systemSvc.nonSpaceString]],
      nationality: [this.user.nationality],
      dob: [this.user.dob ? new Date(this.user.dob).toISOString().substring(0, 10) : ''],
      gender: [this.user.gender ? this.user.gender : '']
    });
  }
  get f() { return this.userForm.controls; }

  checkError(field: string) {
    return this._systemSvc.checkError(this.userForm, field, this.submitted);
  }

  chooseFile() {
    var that = this;
    this.$("#fileUpload").bind('change', function (event) {
      if (event && event.currentTarget && event.currentTarget.files) {
        that.uploadedFile = <File>event.currentTarget.files.item(0);
        if (that.uploadedFile) {
          var reader = new FileReader();
          reader.onload = function (e) {
            var ava = that.$("#avatar");
            if (ava) {
              ava.attr('src', e.target["result"]);
            }
          }
          reader.readAsDataURL(that.uploadedFile);
        }
      }
    }).click();
  }

  hasChangedValues() {
    return (this.f.username.value != this.user.username) || (this.f.nationality.value != this.user.nationality) ||
      (this.f.dob.value != this.user.dob) || (this.f.gender.value != this.user.gender) || (this.uploadedFile)
  }

  updateUser() {
    this.submitted = true;
    if (this.userForm.invalid) {
      return;
    }
    var newInfo = {
      username: this.f.username.value,
      nationality: this.f.nationality.value,
      gender: this.f.gender.value,
      dob: this.f.dob.value
    };

    if (this.uploadedFile) {
      this._systemSvc.uploadFile(this.uploadedFile).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this._log.log('Upload Progress: ' + Math.round(event.loaded / event.total * 100) + "%");
        } else if (event.type === HttpEventType.Response) {
          newInfo["avatar"] = event.body["fileLocation"];
          this._userSvc.updateUser(this.user._id, newInfo).subscribe(result => {
            localStorage.setItem("user", JSON.stringify(result));
          }, err => {
            this._log.log(err);
          });
        }
      }, err => {
        this._log.log(err);
      })
    } else {
      this._userSvc.updateUser(this.user._id, newInfo).subscribe(result => {
        localStorage.setItem("user", JSON.stringify(result));
      }, err => {
        this._log.log(err);
      });
    }
  }
}
