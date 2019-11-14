import { Component, OnInit, Input, AfterViewInit, Inject } from '@angular/core';

@Component({
  selector: 'app-facebook',
  templateUrl: './facebook.component.html',
  styleUrls: ['./facebook.component.css']
})
export class FacebookComponent implements OnInit, AfterViewInit {
  //@Input() url = "http://www.google.com";
  @Input() url = location.href;

  constructor() {
    if (!window['fbAsyncInit']) {
      window['fbAsyncInit'] = function () {
        window['FB'].init({
          appId: '2341935745914929',
          autoLogAppEvents: true,
          xfbml: true,
          version: 'v5.0'
        })
      }
    }

    //load fb sdk if required
    const url = 'https://connect.facebook.net/en_US/sdk.js';
    if (!document.querySelector(`script[src='${url}']`)) {
      let script = document.createElement('script');
      script.src = url;
      document.body.appendChild(script);
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    window['FB'] && window['FB'].XFBML.parse();
  }
}
