import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { IItem } from '../shared/model/item';
import { ItemService } from '../shared/services/item.services';
import { LoggingService } from '../shared/services/system/logging.service';
import { JQ_TOKEN } from '../shared/services/jQuery.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  uploadedFile: File = null;
  item: IItem = {
    _id: null,
    title: "",
    categories: [],
    creditBy: []
  };
  title: string = "";
  tags: string = "";
  creditBy: string = "";
  category: string = "";
  description: string = "";
  constructor(
    private _log: LoggingService,
    private _itemService: ItemService,
    private _http: HttpClient,
    private _router: Router,
    @Inject(JQ_TOKEN) private $: any) { }

  ngOnInit() {

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

  createPost() {
    if (this.uploadedFile) {
      const fd = new FormData();
      fd.append('image', this.uploadedFile, this.uploadedFile.name)
      this._http.post("https://us-central1-architect-c592d.cloudfunctions.net/uploadFile", fd, {
        reportProgress: true,
        observe: 'events'
      }).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this._log.log('Upload Progress: ' + Math.round(event.loaded / event.total * 100) + "%");
        } else if (event.type === HttpEventType.Response) {
          this.item = {
            tags: this.tags.split(","),
            categories: [this.category],
            creditBy: [this.creditBy],
            title: this.title,
            titleUrl: "../../assets/image/title1.JPG",
            url: event.body["fileLocation"],
            thumbnail: "../../assets/image/img1.JPG"
          };

          this._itemService.createItem(this.item).subscribe(newItem => {
            this._log.log(newItem);
            this._router.navigate(["/"]);
          });
        }
      });
    }
    this._log.log("create post");
  }
}
