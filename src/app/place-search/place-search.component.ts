import { AfterViewInit, Component, ElementRef, Input, NgZone, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IItem } from '../shared/model/item';
import { GoogleMapService } from '../shared/services/google-map.service';
declare let google: any;

@Component({
  selector: 'app-place-search',
  templateUrl: './place-search.component.html',
  styleUrls: ['./place-search.component.css']
})
export class PlaceSearchComponent implements AfterViewInit {

  @Input() showMinPrice: boolean = true;
  @Input() showMaxPrice: boolean = true;
  @Input() showKeyword: boolean = true;
  @Input() showLocationSearch: boolean = true;

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
  panTo: any;
  zoomLevel: any;
  @Input() items: IItem[];
  @ViewChild('autocompleteSearchBox', { static: false }) autocompleteSearchBox: ElementRef;
  @ViewChild('infoContentRef', { static: false }) infoContentRef: ElementRef;

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
      params = Object.assign({}, this._activatedRoute.snapshot.queryParams, params, { id: null });
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
      this.dropMarkers();
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
    that.place = that.autocomplete.getPlace();
    that.searchItemWithinLocation(that.place);
  }

  ngOnChanges() {
    //drop the marker when @Input items changed
    if (this.map) {
      this.dropMarkers();
    }
  }

  onMinPriceChange(event) {
    let minPrice = Number(event.target.value);
    if (minPrice < 0) minPrice = 0;
    this.goToNewPath({ minPrice });
  }

  onMaxPriceChange(event) {
    let maxPrice = Number(event.target.value);
    if (maxPrice < 0) maxPrice = 0;
    this.goToNewPath({ maxPrice });
  }

  onTextSearchChange(event) {
    let keyword = event.target.value;
    this.goToNewPath({ keyword });
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
          this.panTo = place.geometry.location;
          this.zoomLevel = 15;
          this.map.panTo(this.panTo);
          this.map.setZoom(this.zoomLevel);          
          return;
        }
        case "postal_code": {
          zipcode = `${component.long_name}${zipcode}`;
          this.goToNewPath({ zipcode });
          this.panTo = place.geometry.location;
          this.zoomLevel = 10;
          this.map.panTo(this.panTo);
          this.map.setZoom(this.zoomLevel);          
          return;
        }
        case "locality": {
          city = component.long_name;
          this.goToNewPath({ city });
          this.panTo = place.geometry.location;
          this.zoomLevel = 8;
          this.map.panTo(this.panTo);
          this.map.setZoom(this.zoomLevel);          
          return;
        }
        case "administrative_area_level_1": {
          state = component.short_name;
          this.goToNewPath({ state });
          this.panTo = place.geometry.location;
          this.zoomLevel = 5;          
          return;
        }
        case "country": {
          country = component.long_name;
          this.goToNewPath({ country });
          this.panTo = place.geometry.location;
          this.zoomLevel = 3;
          this.map.panTo(this.panTo);
          this.map.setZoom(this.zoomLevel);          
          return;
        }
      }
    }
  }

  // Search for hotels in the selected city, within the viewport of the map.
  dropMarkers() {
    let that = this;
    that.clearMarkers();

    // assign a letter of the alphabetic to each marker icon.
    for (let i = 0; i < that.items.length; i++) {
      const markerLetter = String.fromCharCode(
        'A'.charCodeAt(0) + (i % 26)
      );
      const markerIcon = that.MARKER_PATH + markerLetter + '.png';

      // Use marker animation to drop the icons incrementally on the map.
      that.markers[i] = new google.maps.Marker({
        position: that.items[i].geometry.location,
        animation: google.maps.Animation.DROP,
        icon: markerIcon,
      });
      // If the user clicks a  marker, show the details of that
      // in an info window.
      // @ts-ignore TODO refactor to avoid storing on marker      
      google.maps.event.addListener(that.markers[i], 'click', () => {
        that.showInfoWindow(that, that.markers[i], that.items[i]);
      });
      setTimeout(that.dropMarker(i), i * 100);
    }
  }

  dropMarker(i) {
    let that = this;
    return function () {
      that.markers[i].setMap(that.map);
    };
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

  address: string;
  contactPhoneNo: string;
  url: string;
  income: number;
  rentCost: number;
  otherCost: number;
  noOfEmployees: number;
  noOfTables: number;
  noOfChairs: number;
  lastElement: any;
  area: number;
  showInfoWindow(that: any, marker: any, item: any) {
    if (item) {
      if (that.lastElement) {
        that.lastElement.style.border = "";
      }
      let element = document.getElementById(item._id);
      if (element) {
        element.style.border = "3px solid #4287f5";
        element.style.borderRadius = "5px";
        that.lastElement = element;
      }
      that.address = item.address + ', ' + item.city + ', ' + item.state + ' ' + item.zipcode + ', ' +
        item.country;
      that.contactPhoneNo = item.contactPhoneNo;
      that.url = item.files[0].url;
      that.income = item.income;
      that.rentCost = item.rentCost;
      that.otherCost = item.otherCost;
      that.noOfEmployees = item.noOfEmployees;
      that.noOfTables = item.noOfTables;
      that.noOfChairs = item.noOfChairs;
      that.area = item.area;
    }
    let infoContentEl = that.infoContentRef.nativeElement;
    infoContentEl.setAttribute('style', 'display: block');

    that.infoWindow = new google.maps.InfoWindow({
      content: infoContentEl as HTMLElement
    });
    google.maps.event.addListener(that.infoWindow, 'closeclick', () => {
      if (that.lastElement) {
        that.lastElement.style.border = "";
      }
    });
    that.infoWindow.open(that.map, marker);
  }
}
