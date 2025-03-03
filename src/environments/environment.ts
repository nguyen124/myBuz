// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyBHsnTznAoWO5P3exuNG_sWWUxJmJCs9tk',
    authDomain: 'm2meme-dev.firebaseapp.com',
    projectId: 'm2meme-dev'
  },
  recaptcha: {
    siteKey: '6LfDDpQhAAAAAD6Ml2f3AKAj4HGQPUBrQ8upGUCp',
  },
  bucketname: 'm2meme-dev.appspot.com',
  stripe: {
    pk: 'pk_test_51LSD2fJbUrktT3xj6s57seUsslyiQidJwLpl63lEeqjZN1XNh2PsVuCNncoRTqOSKElEWkU5s8JhHW4vPaAUU8VT00PnJIt8pz'
  },
  ITEM_PER_PAGE: 40,
  COMMENT_PER_PAGE: 10,
  REPLY_PER_PAGE: 5
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
