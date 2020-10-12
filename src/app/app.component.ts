import { Component, OnInit, isDevMode } from '@angular/core';
import { environment } from '../environments/environment';
import { environment as prodEnvironment } from '../environments/environment.prod';

declare var firebase: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor() {

  }
  ngOnInit() {
    // Your web app's Firebase configuration
    let devConfig = {
      apiKey: "AIzaSyBHsnTznAoWO5P3exuNG_sWWUxJmJCs9tk",
      authDomain: "m2meme-dev.firebaseapp.com",
      databaseURL: "https://m2meme-dev.firebaseio.com",
      projectId: "m2meme-dev",
      storageBucket: "m2meme-dev.appspot.com",
      messagingSenderId: "502653194411",
      appId: "1:502653194411:web:f6b248828e166c3785a7ee",
      measurementId: "G-42FB2L4JX1"
    };


    let prodConfig = {
      apiKey: "AIzaSyBm-x5W9WTIvamSBi8a1bRreI-014TNHWs",
      authDomain: "m2meme.firebaseapp.com",
      databaseURL: "https://m2meme.firebaseio.com",
      projectId: "m2meme",
      storageBucket: "m2meme.appspot.com",
      messagingSenderId: "325839050136",
      appId: "1:325839050136:web:a6ae359c399ab03da987ed",
      measurementId: "G-MVMYMMDNXP"
    };

    // Initialize Firebase
    firebase.initializeApp(isDevMode() ? devConfig : prodConfig);
  }
}
