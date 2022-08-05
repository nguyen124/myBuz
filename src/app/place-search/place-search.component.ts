import { AfterViewInit, Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleMapService } from '../shared/services/google-map.service';
declare let google: any;

@Component({
  selector: 'app-place-search',
  templateUrl: './place-search.component.html',
  styleUrls: ['./place-search.component.css']
})
export class PlaceSearchComponent implements AfterViewInit {

  countryRestrict: any = { country: 'us' };
  MARKER_PATH: any = 'https://developers.google.com/maps/documentation/javascript/images/marker_green';
  hostnameRegexp: any = new RegExp('^https?://.+?/');
  countries: any = {
    us: {
      center: { lat: 37.1, lng: -95.7 },
      zoom: 3,
    },
    ca: {
      center: { lat: 62, lng: -110.0 },
      zoom: 3,
    },
    // au: {
    //   center: { lat: -25.3, lng: 133.8 },
    //   zoom: 4,
    // },
    // br: {
    //   center: { lat: -14.2, lng: -51.9 },
    //   zoom: 3,
    // },  
    // fr: {
    //   center: { lat: 46.2, lng: 2.2 },
    //   zoom: 5,
    // },
    // de: {
    //   center: { lat: 51.2, lng: 10.4 },
    //   zoom: 5,
    // },
    // mx: {
    //   center: { lat: 23.6, lng: -102.5 },
    //   zoom: 4,
    // },
    // nz: {
    //   center: { lat: -40.9, lng: 174.9 },
    //   zoom: 5,
    // },
    // it: {
    //   center: { lat: 41.9, lng: 12.6 },
    //   zoom: 5,
    // },
    // za: {
    //   center: { lat: -30.6, lng: 22.9 },
    //   zoom: 5,
    // },
    // es: {
    //   center: { lat: 40.5, lng: -3.7 },
    //   zoom: 5,
    // },
    // pt: {
    //   center: { lat: 39.4, lng: -8.2 },
    //   zoom: 6,
    // },
    // uk: {
    //   center: { lat: 54.8, lng: -4.6 },
    //   zoom: 5,
    // },
  };
  map: any;
  places: any;
  place: any;
  infoWindow: any;
  markers: any = [];
  autocomplete: any;
  @ViewChild('autocompleteSearchBox', { static: false }) autocompleteSearchBox: ElementRef;

  constructor(private _apiService: GoogleMapService,
    private _ngZone: NgZone,
    private _route: ActivatedRoute,
    private _activatedRoute: ActivatedRoute,
    private _router: Router) {
  }

  goToNewPath(params) {
    // changes the route without moving from the current view or
    // triggering a navigation event,
    if (params.address) {
      Object.assign(params, { country: null, state: null, city: null, zipcode: null });
    } else if (params.zipcode) {
      Object.assign(params, { country: null, state: null, city: null, address: null });
    } else if (params.city) {
      Object.assign(params, { country: null, state: null, zipcode: null, address: null });
    } else if (params.state) {
      Object.assign(params, { country: null, city: null, zipcode: null, address: null });
    } else if (params.country) {
      Object.assign(params, { state: null, city: null, zipcode: null, address: null });
    }
    //put this navigation inside ngZone because this code is external javascript
    this._ngZone.run(() => {
      params = Object.assign(params, this._activatedRoute.snapshot.queryParams, { id: null });
      this._router.navigate([], {
        queryParams: params,
        queryParamsHandling: 'merge'
      });
    });
  }

  ngAfterViewInit() {
    this._apiService.api.then((maps) => {
      this.buildAutoComplete();
      this.buildMap();
    });
  }

  buildAutoComplete() {
    this.autocomplete = new google.maps.places.Autocomplete(
      this.autocompleteSearchBox.nativeElement,
      {
        componentRestrictions: this.countryRestrict
      }
    );
  }

  buildMap() {
    let that = this;
    that.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      zoom: that.countries['us'].zoom,
      center: that.countries['us'].center,
      mapTypeControl: false,
      panControl: false,
      zoomControl: false,
      streetViewControl: false,
    });
    that.autocomplete.addListener('place_changed', that.zoonInAndSearch);
  }

  zoonInAndSearch = () => {
    let that = this;
    this.place = that.autocomplete.getPlace();
    that.searchItemWithinLocation(this.place);
    if (this.place.geometry && this.place.geometry.location) {
      that.map.panTo(this.place.geometry.location);
      that.map.setZoom(15);
      that.search();
    }
  }

  searchItemWithinLocation(place) {
    let address = "";
    let zipcode = "";
    let city = "";
    let state = "";
    let country = ""
    for (const component of place.address_components as any[]) {
      const componentType = component.types[0];
      switch (componentType) {
        case "street_number": {
          address = `${component.long_name} ${address}`;
          break;
        }
        case "route": {
          address += component.short_name;
          this.goToNewPath({ address });
          return;
        }
        case "postal_code": {
          zipcode = `${component.long_name}${zipcode}`;
          this.goToNewPath({ zipcode });
          return;
        }
        case "locality": {
          city = component.long_name;
          this.goToNewPath({ city });
          return;
        }
        case "administrative_area_level_1": {
          state = component.short_name;
          this.goToNewPath({ state });
          return;
        }
        case "country": {
          country = component.long_name;
          this.goToNewPath({ country });
          return;
        }
      }
    }
  }

  // Search for hotels in the selected city, within the viewport of the map.
  search() {
    let that = this;
    const search = {
      bounds: that.map.getBounds() as any,
      types: ['beauty_salon'],
    };

    that.places = new google.maps.places.PlacesService(that.map);
    that.places.nearbySearch(
      search,
      (
        results: any | null,
        status: any,
        pagination: any | null
      ) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          that.clearResults();
          that.clearMarkers();

          // Create a marker for each hotel found, and
          // assign a letter of the alphabetic to each marker icon.
          for (let i = 0; i < results.length; i++) {
            const markerLetter = String.fromCharCode(
              'A'.charCodeAt(0) + (i % 26)
            );
            const markerIcon = that.MARKER_PATH + markerLetter + '.png';

            // Use marker animation to drop the icons incrementally on the map.
            that.markers[i] = new google.maps.Marker({
              position: (results[i].geometry as any)
                .location,
              animation: google.maps.Animation.DROP,
              icon: markerIcon,
            });
            // If the user clicks a hotel marker, show the details of that hotel
            // in an info window.
            // @ts-ignore TODO refactor to avoid storing on marker
            that.markers[i].placeResult = results[i];
            google.maps.event.addListener(that.markers[i], 'click', () => {
              that.showInfoWindow(that, that.markers[i]);
            });
            setTimeout(that.dropMarker(i), i * 100);
            //that.addResult(results[i], i);
          }
        }
      }
    );
  }

  clearMarkers() {
    if (this.markers) {
      for (let i = 0; i < this.markers.length; i++) {
        if (this.markers[i]) {
          this.markers[i].setMap(null);
        }
      }
      this.markers = [];
    }
  }

  dropMarker(i) {
    let that = this;
    return function () {
      that.markers[i].setMap(that.map);
    };
  }

  //addResult(result, i) {
  //const results = document.getElementById('results') as HTMLElement;
  //const markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
  //const markerIcon = this.MARKER_PATH + markerLetter + '.png';

  //const tr = document.createElement('tr');

  //tr.style.backgroundColor = i % 2 === 0 ? '#F0F0F0' : '#FFFFFF';

  //let that = this;
  // tr.onclick = function () {
  //   google.maps.event.trigger(that.markers[i], 'click');
  // };

  //const iconTd = document.createElement('td');
  //const nameTd = document.createElement('td');
  //const icon = document.createElement('img');

  //icon.src = markerIcon;
  //icon.setAttribute('class', 'placeIcon');
  //icon.setAttribute('className', 'placeIcon');

  //const name = document.createTextNode(result.name);

  //iconTd.appendChild(icon);
  //nameTd.appendChild(name);
  //tr.appendChild(iconTd);
  //tr.appendChild(nameTd);
  //results.appendChild(tr);
  //}

  clearResults() {
    const results = document.getElementById('results') as HTMLElement;

    while (results.childNodes[0]) {
      results.removeChild(results.childNodes[0]);
    }
  }

  // Get the place details for a hotel. Show the information in an info window,
  // anchored on the marker for the hotel that the user selected.
  showInfoWindow(that, marker: any) {
    // @ts-ignore
    //const marker = this;
    that.infoWindow = new google.maps.InfoWindow({
      content: document.getElementById('info-content') as HTMLElement,
    });
    that.places.getDetails(
      { placeId: marker.placeResult.place_id },
      (place, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          return;
        }

        this.infoWindow.open(this.map, marker);
        this.buildIWContent(place);
      }
    );
  }

  // Load the place information into the HTML elements used by the info window.
  buildIWContent(place) {
    (document.getElementById('iw-icon') as HTMLElement).innerHTML =
      '<img class="hotelIcon" ' + 'src="' + place.icon + '"/>';
    (document.getElementById('iw-url') as HTMLElement).innerHTML =
      '<b><a href="' + place.url + '">' + place.name + '</a></b>';
    (document.getElementById('iw-address') as HTMLElement).textContent =
      place.vicinity;

    if (place.formatted_phone_number) {
      (document.getElementById('iw-phone-row') as HTMLElement).style.display = '';
      (document.getElementById('iw-phone') as HTMLElement).textContent =
        place.formatted_phone_number;
    } else {
      (document.getElementById('iw-phone-row') as HTMLElement).style.display =
        'none';
    }

    // Assign a five-star rating to the hotel, using a black star ('&#10029;')
    // to indicate the rating the hotel has earned, and a white star ('&#10025;')
    // for the rating points not achieved.
    if (place.rating) {
      let ratingHtml = '';

      for (let i = 0; i < 5; i++) {
        if (place.rating < i + 0.5) {
          ratingHtml += '&#10025;';
        } else {
          ratingHtml += '&#10029;';
        }

        (document.getElementById('iw-rating-row') as HTMLElement).style.display =
          '';
        (document.getElementById('iw-rating') as HTMLElement).innerHTML =
          ratingHtml;
      }
    } else {
      (document.getElementById('iw-rating-row') as HTMLElement).style.display =
        'none';
    }

    // The regexp isolates the first part of the URL (domain plus subdomain)
    // to give a short URL for displaying in the info window.
    if (place.website) {
      let fullUrl = place.website;
      let website = String(this.hostnameRegexp.exec(place.website));

      if (!website) {
        website = 'http://' + place.website + '/';
        fullUrl = website;
      }

      (document.getElementById('iw-website-row') as HTMLElement).style.display =
        '';
      (document.getElementById('iw-website') as HTMLElement).textContent =
        website;
    } else {
      (document.getElementById('iw-website-row') as HTMLElement).style.display =
        'none';
    }
  }
}
