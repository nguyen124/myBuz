import { Component, OnInit, Inject } from '@angular/core';
import { UserService } from '../../shared/services/user-service.service';
import { IUser } from '../../shared/model/user';
import { AuthService } from '../../shared/services/security/auth.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { SystemService } from '../../shared/services/utils/system.service';
import { JQ_TOKEN } from '../../shared/services/jQuery.service';
import { HttpEventType } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {
  user: IUser;
  uploadedFile: File = null;
  userForm: UntypedFormGroup;
  submitted = false;
  error = null;
  isUploading: boolean;
  uploadingProgress: number;

  constructor(
    private _userSvc: UserService,
    private _authSvc: AuthService,
    private _systemSvc: SystemService,
    private _toastr: ToastrService,
    private _fb: UntypedFormBuilder,
    private _translate: TranslateService,
    @Inject(JQ_TOKEN) private $: any) {
  }

  ngOnInit() {
    this.initValue();
  }

  initValue() {
    this.user = this._authSvc.user;
    this.user.gender = this.user.gender || '';
    this.user.nationality = this.user.nationality || '';
    this.user.dob = this.user.dob || '';
    this.uploadedFile = null;
    this.$("#avatar").attr("src", this.user.avatar);
    this.userForm = this._fb.group({
      file: [null],
      username: [this.user.username, [this._systemSvc.nonSpaceString, Validators.pattern(/^.{1,50}$/)]],
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
    return this.hasUsernameChanged() ||
      this.hasAvatarChanged() ||
      this.hasGenderChanged() ||
      this.hasDoBChanged() ||
      this.hasNationalityChanged();
  }

  hasUsernameChanged() {
    return this.f.username.value != this.user.username;
  }

  hasAvatarChanged() {
    return !!this.uploadedFile;
  }

  hasGenderChanged() {
    return this.f.gender.value != this.user.gender;
  }

  hasDoBChanged() {
    return (this.f.dob.value != this.user.dob) && (new Date(this.f.dob.value)).getTime() != (new Date(this.user.dob)).getTime();
  }

  hasNationalityChanged() {
    return this.f.nationality.value != this.user.nationality;
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
      dob: this.f.dob.value,
      avatar: this.user.avatar,
      hasAvatarChanged: this.hasAvatarChanged(),
      hasUsernameChanged: this.hasUsernameChanged()
    };

    if (this.uploadedFile) {
      this.isUploading = true;
      this._systemSvc.uploadFile(this.uploadedFile).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          //this._toastr.success('Upload Progress: ' + Math.round(event.loaded / event.total * 100) + "%");
          this.uploadingProgress = Math.round((event.loaded / event.total) * 100)
        } else if (event.type === HttpEventType.Response) {
          this.isUploading = false;
          newInfo["avatar"] = event.body["fileLocation"];
          newInfo["filename"] = event.body["filename"];
          this._userSvc.updateUser(this.user._id, newInfo).subscribe(result => {
            this.afterUpdate(result);
          }, err => {
            this.error = this._translate.instant("user.update.updateError");
          });
        }
      }, err => {
        this.isUploading = false;
        this.error = this._translate.instant("user.update.uploadingAvatarError");
      })
    } else {
      this._userSvc.updateUser(this.user._id, newInfo).subscribe(result => {
        this.afterUpdate(result);
      }, err => {
        this.error = this._translate.instant("user.update.updateError");

      });
    }
  }

  afterUpdate(result) {
    this.user = result;
    this._authSvc.user = result;
    localStorage.setItem("user", JSON.stringify(result));
    this.initValue();
  }
}
