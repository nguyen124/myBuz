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
            return reject(err);
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
}