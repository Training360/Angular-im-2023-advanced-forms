import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom,
} from '@angular/core';
import { PreloadAllModules, provideRouter, withComponentInputBinding, withPreloading } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { jwtInterceptor } from './interceptor/jwt.interceptor';
import { GeoipDataService } from './service/geoip-data.service';
import { FlagBasedPreloadingStrategy } from './service/flag-based.preloading-strategy';

export function initGeo(service: GeoipDataService) {
  return () => service.init();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(),
      withPreloading(FlagBasedPreloadingStrategy),
    ),
    provideAnimations(),
    provideHttpClient(withInterceptors([jwtInterceptor])),
    importProvidersFrom([FlexLayoutModule]),
    provideStore(),
    provideEffects(),
    {
      provide: APP_INITIALIZER,
      useFactory: initGeo,
      deps: [GeoipDataService],
      multi: true,
    },
  ],
};
