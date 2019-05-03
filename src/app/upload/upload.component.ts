import { Component, OnInit } from '@angular/core';
import { FileService } from '../services/file.service';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { IItem } from '../model/item';
import { ItemService } from '../services/item.services';
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
  constructor(private _fileService: FileService, private _itemService: ItemService, private http: HttpClient) { }

  ngOnInit() {

  }

  handleFileInput(files: FileList) {
    this.uploadedFile = <File>files.item(0);
    if (this.uploadedFile) {
      var reader = new FileReader();
      reader.onload = function (e) {
        $("#previewImg").attr('src', e.target["result"]).width(150).height(200);
      }
      reader.readAsDataURL(this.uploadedFile);
    }
  }

  createPost() {
    if (this.uploadedFile) {
      const fd = new FormData();
      fd.append('image', this.uploadedFile, this.uploadedFile.name)
      this.http.post("https://us-central1-architect-c592d.cloudfunctions.net/uploadFile", fd, {
        reportProgress: true,
        observe: 'events'
      }).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          console.log('Upload Progress: ' + Math.round(event.loaded / event.total * 100) + "%");
        } else if (event.type === HttpEventType.Response) {
          this.item = {
            "tags": this.tags.split(","),
            "categories": [this.category],
            "creditBy": [this.creditBy],
            "title": this.title,
            "titleUrl": "../../assets/image/title1.JPG",
            "url": event.body["fileLocation"],
            "thumbnail": "../../assets/image/img1.JPG",
            "modifiedDate": (new Date().getTime()),
            "createdBy": JSON.parse(localStorage.getItem('currentUser')),
            "point": 0,
            "seen": 0,
            "share": 0,
            "comment": 0            
          }
          this._itemService.createItem(this.item).subscribe(res => {
            console.log(res);
          });
        }
      });
    }
    console.log("create post");
  }
  // postFile(fileToUpload: File): Observable<any> {
  //   const endpoint = '';
  //   const formData: FormData = new FormData();
  //   formData.append('fileKey', fileToUpload, fileToUpload.name);
  //   return this._http.post(endpoint, formData, { headers:  });
  // }
}
