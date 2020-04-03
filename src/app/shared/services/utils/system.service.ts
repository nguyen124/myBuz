import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';

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
      fd.append('image', uploadedFile, uploadedFile.name);
      return this._http.post("/svc/uploadFile", fd, {
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
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }

  nonSpaceString(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  checkFileMaxSize(control: FormControl) {
    let files = control.value;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        if (files[i].size / (1024 * 1024) > 10) {
          return { largeFile: true };
        }
      }
    }
    // let errorIndexes = [];
    // if (files) {
    //   for (let i = 0; i < files.length; i++) {
    //     if (files[i].size / (1024 * 1024) > 10) {
    //       errorIndexes.push(i);
    //     }
    //   }
    //   if (errorIndexes.length > 0) {
    //     return { largeFile: errorIndexes };
    //   }
    //   return null;
    // }
    return null;
  }

  checkError(form: FormGroup, field: string, submitted: boolean) {
    var f = form.controls;
    return ((form.pristine && f[field].touched) || submitted) && f[field].errors;
  }

  setCursor(el) {
    var range = document.createRange();
    var sel = window.getSelection();
    range.setStart(el.children[1], 0);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  getReasons() {
    return [
      { name: 'Graphic content', value: '1', checked: false },
      { name: '18- Content', value: '2', checked: false },
      { name: 'Other', value: '3', checked: false }
    ]
  }
}
