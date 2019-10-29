import { Component, OnInit, Inject } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { ItemService } from '../shared/services/item.services';
import { LoggingService } from '../shared/services/system/logging.service';
import { JQ_TOKEN } from '../shared/services/jQuery.service';
import { Router } from '@angular/router';
import { SystemService } from '../shared/services/utils/system.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  uploadedFile: File = null;
  parsedTags: string[] = [];
  itemForm: FormGroup;
  submitted = false;
  error: any;

  constructor(
    private _log: LoggingService,
    private _itemSvc: ItemService,
    private _systemSvc: SystemService,
    private _router: Router,
    private _fb: FormBuilder,
    @Inject(JQ_TOKEN) private $: any) { }

  ngOnInit() {
    this.itemForm = this._fb.group({
      title: ['', [Validators.required, this.nonSpaceString]],
      file: ['', Validators.required],
      categories: [''],
      tags: ['']
    })
  }

  nonSpaceString(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  get f() { return this.itemForm.controls; }

  checkError(field) {
    return ((!this.itemForm.pristine && this.f[field].touched) || this.submitted)
      && this.f[field].errors
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
    this.parsedTags = input.split(/[ ,;.\/\\]+/).slice(0, 5).filter(function (el) { return el.length != 0 });
    this.parsedTags.sort();
  }

  createPost() {
    this.submitted = true;
    if (this.itemForm.invalid) {
      this.error = { error: "INVALID FIELDS!" };
      return;
    }
    this._systemSvc.uploadFile(this.uploadedFile).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this._log.log('Upload Progress: ' + Math.round(event.loaded / event.total * 100) + "%");
      } else if (event.type === HttpEventType.Response) {
        var item = {
          tags: this.parsedTags,
          categories: [this.f.categories.value],
          title: this.f.title.value,
          url: event.body["fileLocation"]
        };

        this._itemSvc.createItem(item).subscribe(newItem => {
          this._log.log("New Item created: " + newItem);
          this.$("#cancelBtn")[0].click();
          this._router.navigate(["/user"]);
        });
      }
    });
  }
}
