import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private _http: HttpClient) { }

  register(user: any): any {
    return this._http.post<any>("/svc/users/signup", user).subscribe(res => {
      console.log(res);
    });
  }
}
