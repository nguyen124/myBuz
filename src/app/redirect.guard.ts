import { Injectable, isDevMode } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { GoogleMapService } from './shared/services/google-map.service';
import { AuthService } from './shared/services/security/auth.service';
import { environment } from '../environments/environment';
import { environment as prodEnvironment } from '../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class RedirectGuard implements CanActivate {
  readonly PER_PAGE: number = isDevMode() ? environment.ITEM_PER_PAGE : prodEnvironment.ITEM_PER_PAGE;

  constructor(private _router: Router, private _apiService: GoogleMapService, private _authSvc: AuthService) { }
  async canActivate(route: ActivatedRouteSnapshot) {
    let constructedLocation = null;
    let params = Object.assign({}, route.queryParams, { user: null });
    if (this._apiService.firstTimeShowingLocation) {
      return true;
    }
    if (params.address || params.city || params.state || params.zipcode || params.country) {
      let address = params.address ? params.address.trim() : '';
      let city = params.city ? params.city.trim() : '';
      let state = params.state ? params.state.trim() : '';
      let zipcode = params.zipcode ? params.zipcode.trim() : '';
      let country = params.country ? params.country.trim() : '';
      constructedLocation = `${address} ${city} ${state} ${zipcode} ${country}`;
    }

    const userLocation = await this._apiService.getUserLocation(constructedLocation);
    let locationParams = null;
    if (userLocation) {
      locationParams = await this._apiService.getLocationParams(userLocation);
    }
    if (params.page && params.perPage) {
      if (locationParams) {
        if (params.address || params.city || params.zipcode || params.state || params.country) {
          return true;
        }
      } else {
        return true;
      }
    }
    if (locationParams && Object.keys(locationParams).length > 0) {
      this._apiService.firstTimeShowingLocation = true;
      return this._router.navigate([route.routeConfig.path], {
        queryParams: Object.assign({ page: 0, perPage: this.PER_PAGE }, params, locationParams),
        queryParamsHandling: "merge"
      });
    } else {
      this._router.navigate([route.routeConfig.path], {
        queryParams: Object.assign({ page: 0, perPage: this.PER_PAGE }, params),
        queryParamsHandling: "merge"
      });
    }
    return false;
  }
}
