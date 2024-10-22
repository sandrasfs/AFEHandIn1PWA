import { ApplicationConfig, provideExperimentalZonelessChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideToastr } from 'ngx-toastr';
import { provideServiceWorker } from '@angular/service-worker';


export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(), 
    provideRouter(routes), 
    provideClientHydration(), 
    provideHttpClient(), 
    provideAnimationsAsync(), 
    provideToastr({positionClass: 'toast-bottom-left'}), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          }), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          })]
};
