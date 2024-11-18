import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {getAuth, provideAuth} from '@angular/fire/auth';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideFirebaseApp(() => initializeApp({
      'projectId': 'crud-with-materialui-9a269',
      'appId': '1:272343668005:web:8c28956b838bd2aa5036cc',
      'databaseURL': 'https://crud-with-materialui-9a269-default-rtdb.europe-west1.firebasedatabase.app',
      'storageBucket': 'crud-with-materialui-9a269.firebasestorage.app',
      'apiKey': 'AIzaSyAWaOOjVgaYXJUSS79Xn-1yDX6I5E3FMjM',
      'authDomain': 'crud-with-materialui-9a269.firebaseapp.com',
      'messagingSenderId': '272343668005'
    })), provideAuth(() => getAuth()),
  ]
};
