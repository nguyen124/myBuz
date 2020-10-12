import { Component, OnInit, Inject, HostListener, isDevMode } from '@angular/core';
import { ItemService } from '../shared/services/item.services';
import { JQ_TOKEN } from '../shared/services/jQuery.service';
import { Router } from '@angular/router';
import { SystemService } from '../shared/services/utils/system.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommunicateService } from '../shared/services/utils/communicate.service';
import { FileValidatorDirective } from './file-validator.directive';
import { AuthService } from '../shared/services/security/auth.service';
import { environment } from '../../environments/environment';
import { environment as prodEnvironment } from '../../environments/environment.prod';


declare var firebase: any;

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  parsedTags: string[] = [];
  itemForm: FormGroup;
  submitted = false;
  isUploading = false;
  uploadingProgress: number;
  today = new Date();
  destination: string = "";
  filesArr: File[] = [];
  toUploadFiles: any[] = [];
  uploadTask: any;

  constructor(
    private _itemSvc: ItemService,
    private _systemSvc: SystemService,
    private _commSvc: CommunicateService,
    private _toastr: ToastrService,
    private _router: Router,
    private _fb: FormBuilder,
    private _authSvc: AuthService,
    @Inject(JQ_TOKEN) private $: any) { }

  @HostListener('document:keydown.escape', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.resetFormValues();
  }

  ngOnInit() {
    this.initForm();
    this.destination = this.today.getFullYear() + "/" + this.today.getMonth() + "/" + this.today.getDate() + "/" + this._authSvc.user.username + "/";
  }

  initForm() {
    this.itemForm = this._fb.group({
      title: ['', [Validators.required, this._systemSvc.nonSpaceString]],
      file: ['', [FileValidatorDirective.validate, this._systemSvc.checkFileMaxSize]],
      categories: ['General'],
      tags: [''],
      description: ['', [Validators.maxLength(10000)]],
    });
  }

  get f() { return this.itemForm.controls; }

  checkError(field: string) {
    return this._systemSvc.checkError(this.itemForm, field, this.submitted);
  }

  handleFileInput(files: FileList) {
    var fileArr = [],
      that = this;
    for (let idx = 0; idx < files.length; idx++) {
      fileArr.push(files[idx]);
    }
    if (this.toUploadFiles && this.toUploadFiles.length) {
      this.itemForm.controls.file.setValue(true);
    }

    fileArr.forEach(toUploadFile => {
      if (toUploadFile) {
        let reader = new FileReader();
        reader.onload = function (e) {
          that.toUploadFiles.push({
            url: e.target["result"],
            fileType: toUploadFile.type,
            pathName: that.destination + toUploadFile.name
          });
        }
        reader.readAsDataURL(toUploadFile);
      }
    });
  }

  onTagsChange(input) {
    this.parsedTags = input.split(/[ ,;.\/\\]+/).slice(0, 5).filter(el => el.length != 0);
  }

  createPost() {
    this.submitted = true;
    if (this.itemForm.invalid) {
      return;
    }
    let uploadedResults = [];
    var that = this;
    let storage = firebase.storage().ref();
    this.toUploadFiles.forEach(file => {
      var storageRef = storage.child(file.pathName);
      that.uploadTask = storageRef.putString(file.url, 'data_url', {
        contentType: file.fileType,
      });
      // Listen for state changes, errors, and completion of the upload.
      that.uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        (snapshot) => {
          that.handleSnapshot(snapshot, that);
        },
        (error) => {
          that.handleFirebaseUploadError(error);
        },
        () => {
          that.handleSuccess(that.uploadTask, uploadedResults);
        }
      );
    });
  }

  handleSnapshot(snapshot, that) {
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    that.isUploading = true;
    that.uploadingProgress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
    // this._toastr.info('Upload is ' + this.uploadingProgress + '% done');

    switch (snapshot.state) {
      case firebase.storage.TaskState.PAUSED: // or 'paused'
        that._toastr.info('Upload is paused');
        break;
      case firebase.storage.TaskState.RUNNING: // or 'running'
        //this._toastr.info('Upload is running');
        break;
    }
  }

  handleSuccess(uploadTask, uploadedResults) {
    // Upload completed successfully, now we can get the download URL
    this._toastr.success("Upload finished!")
    // uploadTask.snapshot.ref.getDownloadURL().then((downloadURL: string) => {

    // });
    let bucketName = isDevMode() ? environment.bucketname : prodEnvironment.bucketname;
    let downloadURL = 'https://storage.googleapis.com/' + bucketName + '/' + uploadTask.snapshot.metadata.fullPath;

    uploadedResults.push({
      url: downloadURL,
      filename: uploadTask.snapshot.metadata.fullPath,
      fileType: uploadTask.snapshot.metadata.contentType
    })
    if (uploadedResults.length == this.toUploadFiles.length) {
      let item = {
        tags: this.parsedTags,
        categories: [this.f.categories.value],
        title: this.f.title.value,
        description: this.f.description.value == null ? '' : this.f.description.value.trim(),
        files: uploadedResults
      };

      this._itemSvc.createItem(item).subscribe(newItem => {
        this._toastr.success("New post has been created!");
        var modalDismiss = this.$("#cancelBtn");
        if (modalDismiss && modalDismiss[0]) { modalDismiss.click(); }
        this._commSvc.uploadItem(newItem);
        this.resetFormValues();
        this._router.navigate(["/user/items"]);
      }, err => {
        this.handleError(err);
      });
    }
  }

  handleFirebaseUploadError(error) {
    // Errors list: https://firebase.google.com/docs/storage/web/handle-errors
    switch (error.code) {
      case 'storage/unauthorized':
        // User doesn't have permission to access the object
        break;

      case 'storage/canceled':
        // User canceled the upload
        break;

      case 'storage/unknown':
        // Unknown error occurred, inspect error.serverResponse
        break;
    }
  }

  handleError(err) {
    this._toastr.error("Oops! Failed to create post!");
    console.log(err);
    this.isUploading = false;
  }

  resetFormValues() {
    this.itemForm.reset();
    this.initForm();

    this.toUploadFiles = [];
    this.isUploading = false;
    this.submitted = false;
    this.parsedTags = [];
    this.cancelUploading(this);
  }

  removePreviewMedia(index) {
    this.toUploadFiles.splice(index, 1);
    return false;
  }

  cancelUploading(that) {
    that.uploadTask.cancel();
    // else {
    //   //Upload is complete, but user wanted to cancel. Let's delete the file
    //   that.uploadTask.snapshot.ref.delete();
    //   // storageRef.delete(); // will delete all your files
    // }
  }
}
