import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SystemService {
  constructor(private _http: HttpClient) { }

  public uploadMultiFiles(files: Set<File>): { [key: string]: { progress: Observable<number> } } {
    // this will be the resulting map
    const status: { [key: string]: { progress: Observable<number> } } = {};
    files.forEach(file => {
      // create a new progress-subject for every file
      const progress = new Subject<number>();
      this.uploadFile(file).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          const percentDone = Math.round(100 * event.loaded / event.total);
          progress.next(percentDone);
        } else if (event instanceof HttpResponse) {
          // Close the progress-steam if we get an answer form the API
          // The upload is complete
          progress.complete();
        }
      });
      //Save every progress-observable in a map of all observables
      status[file.name] = {
        progress: progress.asObservable()
      };
    });
    return status;
  }

  uploadFile(uploadedFile: File): Observable<any> {
    if (uploadedFile) {
      const fd = new FormData();
      fd.append('image', uploadedFile, uploadedFile.name)
      return this._http.post("https://us-central1-architect-c592d.cloudfunctions.net/uploadFile", fd, {
        reportProgress: true,
        observe: 'events'
      });
    }
  }

  getCookie(cname): string {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
  }

  eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
  }
}
