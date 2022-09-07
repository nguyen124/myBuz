import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { GoogleMapService } from './shared/services/google-map.service';
import { AuthService } from './shared/services/security/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RedirectGuard implements CanActivate {

  constructor(private _router: Router, private _apiService: GoogleMapService, private _authSvc: AuthService) { }
  async canActivate(route: ActivatedRouteSnapshot) {
    let constructedLocation = null;
    let params = Object.assign({}, route.queryParams, { user: null });
    if (params.address || params.city || params.state || params.zipcode || params.country) {
      let address = params.address ? params.address.trim() : '';
      let city = params.city ? params.city.trim() : '';
      let state = params.state ? params.state.trim() : '';
      let zipcode = params.zipcode ? params.zipcode.trim() : '';
      let country = params.country ? params.country.trim() : '';
      constructedLocation = `${address}, ${city}, ${state} ${zipcode}, ${country}`;
    } else if (this._apiService.firstTimeShowingLocation) {
      return true;
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
        queryParams: Object.assign({ page: 0, perPage: 40 }, params, locationParams),
        queryParamsHandling: "merge"
      });
    } else {
      this._router.navigate([route.routeConfig.path], {
        queryParams: Object.assign({ page: 0, perPage: 40 }, params),
        queryParamsHandling: "merge"
      });
    }
    return false;
  }
}
