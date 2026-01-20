import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/security/auth.service';

@Injectable()
export class AdminAuthGuard  {

    constructor(private _router: Router, private _authSvc: AuthService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this._authSvc.isLoggedIn() && this._authSvc.user.role === 'ADMIN') {
            return true;
        }
        this._router.navigate(['/login'], { queryParams: { returnUrl: state.url } });

        return false;
    }
}