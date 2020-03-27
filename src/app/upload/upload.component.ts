import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { ItemService } from '../shared/services/item.services';
import { JQ_TOKEN } from '../shared/services/jQuery.service';
import { Router } from '@angular/router';
import { SystemService } from '../shared/services/utils/system.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommunicateService } from '../shared/services/utils/communicate.service';
import { FileValidatorDirective } from './file-validator.directive';
import { throwIfEmpty } from 'rxjs/operators';
@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  uploadedFiles: File[] = [];
  parsedTags: string[] = [];
  itemForm: FormGroup;
  submitted = false;
  isUploading = false;
  previewMediaSrcs: any[] = [];
  constructor(
    private _itemSvc: ItemService,
    private _systemSvc: SystemService,
    private _commSvc: CommunicateService,
    private _toastr: ToastrService,
    private _router: Router,
    private _fb: FormBuilder,
    @Inject(JQ_TOKEN) private $: any) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.itemForm = this._fb.group({
      title: ['', [Validators.required, this._systemSvc.nonSpaceString]],
      file: ['', FileValidatorDirective.validate],
      categories: [''],
      tags: ['']
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
    if (this.uploadedFiles && this.uploadedFiles.length) {
      this.itemForm.controls.file.setValue(true);
    }
    fileArr.forEach(uploadedFile => {
      that.uploadedFiles.push(uploadedFile);
      if (uploadedFile) {
        let reader = new FileReader();
        reader.onload = function (e) {
          that.previewMediaSrcs.push({
            url: e.target["result"],
            fileType: uploadedFile.type
          });
        }
        reader.readAsDataURL(uploadedFile);
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
    this.uploadedFiles.forEach(file => {
      this._systemSvc.uploadFile(file).subscribe(event => {
        that.isUploading = true;
        if (event.type === HttpEventType.UploadProgress) {
          this._toastr.success('Upload Progress: ' + Math.round(event.loaded / event.total * 100) + "%");
        } else if (event.type === HttpEventType.Response) {
          uploadedResults.push({
            url: event.body["fileLocation"],
            filename: event.body["filename"],
            fileType: file.type
          });
          if (uploadedResults.length == this.uploadedFiles.length) {
            let item = {
              tags: this.parsedTags,
              categories: [this.f.categories.value],
              title: this.f.title.value,
              files: uploadedResults
            };

            this._itemSvc.createItem(item).subscribe(newItem => {
              this._toastr.success("New post has been created!")
              var modalDismiss = this.$("#cancelBtn");
              if (modalDismiss && modalDismiss[0]) { modalDismiss.click(); }
              this._commSvc.uploadItem(newItem);
              this.resetFormValues();
              this._router.navigate(["/user/items"]);
            }, err => {
              this.handleError();
            });
          }
        }
      }, err => {
        this.handleError();
      });
    });
  }

  handleError() {
    this._toastr.error("Oops! Failed to create post!");
    this.isUploading = false;
  }

  resetFormValues() {
    this.itemForm.reset();
    this.previewMediaSrcs = [];
    this.uploadedFiles = [];
    this.isUploading = false;
    this.submitted = false;
    this.parsedTags = [];
  }
}
