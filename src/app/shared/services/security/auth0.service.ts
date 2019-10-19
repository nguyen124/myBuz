// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Router } from '@angular/router';
// import { CommunicateService } from '../utils/communicate.service';
// import { Auth0Lock } from 'auth0-lock';

// @Injectable({
//     providedIn: 'root'
// })
// export class Auth0Service {
//     wm = new WeakMap();
//     privateStore = {};
//     lock;

//     constructor(
//         private _router: Router,
//         private _http: HttpClient,
//         private _commSvc: CommunicateService) {
//         this.lock = new Auth0Lock(
//             'jJh97LbaJfhvkG9Ynl3gm84yK1t4UMLr',
//             'dev-vh6ko5i8.auth0.com',
//             {
//                 responseType: 'token id_token',
//                 sso: false,
//                 redirectUrl: 'http://localhost:4200'
//             }
//         );
//         this.wm.set(this.privateStore, {
//             appName: "architect"
//         });
//     }

//     getUser() {
//         return this.wm.get(this.privateStore).profile;
//     }

//     logOut() {
//         this.lock.logOut();
//     }

//     logIn() {
//         // Listening for the authenticated event
//         this.lock.show();

//         this.lock.on("authenticated", function (authResult) {
//             // Use the token in authResult to getUserInfo() and save it if necessary
//             this.getUserInfo(authResult.accessToken, function (error, profile) {
//                 if (error) {
//                     // Handle error
//                     return;
//                 }

//                 //we recommend not storing Access Tokens unless absolutely necessary
//                 this.wm.set(this.privateStore, {
//                     accessToken: authResult.accessToken
//                 });

//                 this.wm.set(this.privateStore, {
//                     profile: profile
//                 });

//             });
//         });
//     }
// }

