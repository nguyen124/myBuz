import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SystemService {
  constructor(private http: HttpClient) { }

  public upload(files: Set<File>): { [key: string]: { progress: Observable<number> } } {
    // this will be the resulting map
    const status: { [key: string]: { progress: Observable<number> } } = {};
    files.forEach(file => {
      // create a multipart-form for every file
      const formData: FormData = new FormData();
      formData.append('file', file, file.name);
      // create a http-post request and pass the form
      // tell it to report the upload progress
      const req = new HttpRequest('POST', '/upload', formData, { reportProgress: true });
      // create a new progress-subject for every file
      const progress = new Subject<number>();
      // send the http-request and subscribe for progress-updates
      this.http.request(req).subscribe(event => {
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
