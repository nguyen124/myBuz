import { Component, OnInit } from '@angular/core';
declare let google: any;
@Component({
  selector: 'app-place-search',
  templateUrl: './place-search.component.html',
  styleUrls: ['./place-search.component.css']
})
export class PlaceSearchComponent implements OnInit {
  location: string = "";
  initAutocomplete: any;

  constructor() { }

  ngOnInit(): void {
    this.invokeGoogleApi();
  }

  invokeGoogleApi() {
    if (!window.document.getElementById('google-map-script')) {
      const script = window.document.createElement('script');
      script.id = 'google-map-script';
      script.type = 'text/javascript';
      script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyA-WBvgiVGTXpgfb9SyjHU8XczqFFzDZLk&libraries=places&callback=initAutocomplete';
      script.onload = () => {
        this.initAutocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'),
          {
            componentRestrictions: { country: ["us", "ca"] },
            fields: ["address_components", "geometry"],
            types: ['(regions)'],
          });
      };
      window.document.body.appendChild(script);
    }
  }

}
