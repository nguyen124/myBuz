import { Component, OnInit } from '@angular/core';
import { FileService } from '../services/file.service';
import { HttpClient, HttpEventType } from '@angular/common/http';
@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  uploadedFile: File = null;
  title: String = "";
  tags: String = "";
  constructor(private fileService: FileService, private http: HttpClient) { }

  ngOnInit() {

  }

  handleFileInput(files: FileList) {
    this.uploadedFile = <File>files.item(0);
    if (this.uploadedFile) {
      var reader = new FileReader();
      reader.onload = function (e) {
        $("#previewImg").attr('src', e.target.result).width(150).height(200);
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
        } else {
          console.log(event);
        }
      });
    }
    console.log("create post");
    console.log(this.title);
    console.log(this.tags);
  }
  // postFile(fileToUpload: File): Observable<any> {
  //   const endpoint = '';
  //   const formData: FormData = new FormData();
  //   formData.append('fileKey', fileToUpload, fileToUpload.name);
  //   return this._http.post(endpoint, formData, { headers:  });
  // }
}
