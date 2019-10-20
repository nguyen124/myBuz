import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../security/auth.service';
import { IUser } from '../../model/user';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptorService implements HttpInterceptor {

  constructor(private _authSvc: AuthService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available    
    if (this._authSvc.user) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this._authSvc.user.accessToken}`
        }
      });
    }
    return next.handle(request);
  }
}
