import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
declare let google: any;

const GOOGLE_MAPS_API_KEY = 'AIzaSyA-WBvgiVGTXpgfb9SyjHU8XczqFFzDZLk';

export type Maps = typeof google.maps;

@Injectable({
  providedIn: 'root'
})
export class GoogleMapService {

  public readonly api = this.load();
  public panTo: any = null;
  public zoomLevel: number = null;
  public firstTimeShowingLocation = false;
  private load(): Promise<Maps> {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    // tslint:disable-next-line:no-bitwise
    const callbackName = `GooglePlaces_cb_` + ((Math.random() * 1e9) >>> 0);
    script.src = this.getScriptSrc(callbackName);

    interface MyWindow { [name: string]: Function; };
    const myWindow: MyWindow = window as any;

    const promise = new Promise((resolve, reject) => {
      myWindow[callbackName] = resolve;
      script.onerror = reject;
    });
    document.body.appendChild(script);
    return promise.then(() => google.maps);
  }

  private getScriptSrc(callback: string): string {
    interface QueryParams { [key: string]: string; };
    const query: QueryParams = {
      v: '3',
      callback,
      key: GOOGLE_MAPS_API_KEY,
      libraries: 'places',
    };
    const params = Object.keys(query).map(key => `${key}=${query[key]}`).join('&');
    return `//maps.googleapis.com/maps/api/js?${params}`;
  }

  getUserLocation(inputLocation?: string) {
    return new Promise((resolve, reject) => {
      if (!inputLocation) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            this.api.then(() => {
              const geocoder = new google.maps.Geocoder();
              geocoder
                .geocode({ location: { lat: position.coords.latitude, lng: position.coords.longitude } })
                .then(res => {
                  for (let place of res.results) {
                    if (place.address_components.length === 4) {
                      return resolve(place);
                    }
                  }
                  return resolve({});
                });
            });
          }, (err) => {
            return resolve(null);
          });
        }
      } else {
        this.api.then(() => {
          const geocoder = new google.maps.Geocoder();
          geocoder
            .geocode({ address: inputLocation })
            .then(res => {
              if (res && res.results && res.results.length > 0) {
                return resolve(res.results[0]);
              }
              return resolve({});
            });
        });
      }
    });
  }

  getLocationParams(place) {
    let address = null;
    let zipcode = null;
    let city = null;
    let state = null;
    let country = null;
    return new Promise((resolve, reject) => {
      for (let i = place.address_components.length - 1; i--; i >= 0) {
        let component = place.address_components[i];
        const componentType = component.types[0];
        switch (componentType) {
          case "street_number": {
            this.panTo = place.geometry.location;
            this.zoomLevel = 15;
            address = address ? component.long_name + ' ' + address : component.long_name;
            break;
          }
          case "route": {
            address = component.long_name;
            this.panTo = place.geometry.location;
            this.zoomLevel = 15;
            break;
          }
          case "postal_code": {
            zipcode = component.long_name;
            this.panTo = place.geometry.location;
            this.zoomLevel = 10;
            break;
          }
          case "locality": {
            city = component.long_name;
            this.panTo = place.geometry.location;
            this.zoomLevel = 8;
            break;
          }
          case "administrative_area_level_1": {
            state = component.short_name;
            this.panTo = place.geometry.location;
            this.zoomLevel = 5;
            break;
          }
          case "country": {
            country = component.long_name;
            this.panTo = place.geometry.location;
            this.zoomLevel = 3;
            break;
          }
        }
      }
      resolve(Object.assign({}, address ? { address } : null, zipcode ? { zipcode } : null, city ? { city } : null, state ? { state } : null, country ? { country } : null));
    });
  }
}