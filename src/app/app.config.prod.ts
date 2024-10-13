import {ApplicationConfig, LOCALE_ID, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import locateUK from '@angular/common/locales/uk';

import {routes} from './app.routes';
import {provideHttpClient} from '@angular/common/http';
import {registerLocaleData} from '@angular/common';

const environment = {
  production: true,
  aipUrl: 'https://crud-with-materialui-9a269-default-rtdb.europe-west1.firebasedatabase.app'
};

registerLocaleData(locateUK, 'uk');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideHttpClient(),
    provideHttpClient(),
    {provide: 'API_URL', useValue: environment.aipUrl},
    {provide: LOCALE_ID, useValue: 'uk'},

  ]
};
