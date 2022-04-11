// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase : {
    apiKey: "AIzaSyC79bO4W3NAW6tjRGe8Y-cx9bK2Nb5t760",
    authDomain: "aviva-mamapp-prod.firebaseapp.com",
    databaseURL: "https://aviva-mamapp-prod.firebaseio.com",
    projectId: "aviva-mamapp-prod",
    storageBucket: "aviva-mamapp-prod.appspot.com",
    messagingSenderId: "123950719277",
    appId: "1:123950719277:web:331d4e07590df134be73a4",
    vapidKey: "BNugPlxP0hl1xCp4ljT33EP6W-zUtirN4_yaCDwA48jKLuU494AX_kDQnyXx8pEFnQ7G0PjKZL8Lt9Nvzwtfn3E",
  }
};

export const API_ENDPOINT = "https://api.aviva.pe/middleware2/api/v2/"; 
 export const API_NOTAS = "https://api.aviva.pe/middleware2/api/v2/mama";   

/*  export const API_ENDPOINT = "https://dappapache02.eastus.cloudapp.azure.com/middleware2/api/v2/";  
export const API_NOTAS = "https://dappapache02.eastus.cloudapp.azure.com/middleware2/api/v2/mama/";  */

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
