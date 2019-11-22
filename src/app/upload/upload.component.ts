import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { ItemService } from '../shared/services/item.services';
import { JQ_TOKEN } from '../shared/services/jQuery.service';
import { Router } from '@angular/router';
import { SystemService } from '../shared/services/utils/system.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommunicateService } from '../shared/services/utils/communicate.service';
import { IItem } from '../shared/model/item';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit, OnDestroy {
  uploadedFile: File = null;
  parsedTags: string[] = [];
  itemForm: FormGroup;
  submitted = false;
  subScription: Subscription;
  isEditting = false;
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
    this.subScription = this._commSvc.newEdittingItem$.subscribe(item => {
      if (item) {
        this.isEditting = true;
        setTimeout(() => {
          this.$("#createItemBtn").click();
          this.initForm(item);
        }, 0);
      }
    })
  }

  initForm(item?: IItem) {
    if (!item) {
      this.itemForm = this._fb.group({
        title: ['', [Validators.required, this._systemSvc.nonSpaceString]],
        file: ['', Validators.required],
        categories: [''],
        tags: ['']
      })
    } else {
      this.itemForm = this._fb.group({
        title: [item.title, [Validators.required, this._systemSvc.nonSpaceString]],
        file: ['', Validators.required],
        categories: [item.categories],
        tags: [item.tags]
      });
      this.$("#previewImg").attr('src', item.url);
      this.onTagsChange(item.tags.toString());
    }
  }

  get f() { return this.itemForm.controls; }

  checkError(field: string) {
    return this._systemSvc.checkError(this.itemForm, field, this.submitted);
  }

  handleFileInput(files: FileList) {
    this.uploadedFile = <File>files.item(0);
    let that = this;
    if (this.uploadedFile) {
      var reader = new FileReader();
      reader.onload = function (e) {
        that.$("#previewImg").attr('src', e.target["result"]);
      }
      reader.readAsDataURL(this.uploadedFile);
    }
  }

  onTagsChange(input) {
    this.parsedTags = input.split(/[ ,;.\/\\]+/).slice(0, 5).filter(el => el.length != 0);
    this.parsedTags.sort();
  }

  createPost() {
    this.submitted = true;
    if (this.itemForm.invalid) {
      return;
    }
    this._systemSvc.uploadFile(this.uploadedFile).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this._toastr.success('Upload Progress: ' + Math.round(event.loaded / event.total * 100) + "%");
      } else if (event.type === HttpEventType.Response) {
        var item = {
          tags: this.parsedTags,
          categories: [this.f.categories.value],
          title: this.f.title.value,
          url: event.body["fileLocation"]
        };

        this._itemSvc.createItem(item).subscribe(newItem => {
          this._toastr.success("New post has been created!")
          var modalDismiss = this.$("#cancelBtn");
          if (modalDismiss && modalDismiss[0]) { modalDismiss.click(); }
          this._commSvc.uploadItem(newItem);
          this._router.navigate(["/user/items"]);
        }, err => {
          this._toastr.error("Oops! Failed to create post!");
        });
      }
    }, err => {
      this._toastr.error("Oops! Failed to create post!");
    });
  }

  ngOnDestroy() {
    this.subScription.unsubscribe();
  }
}
