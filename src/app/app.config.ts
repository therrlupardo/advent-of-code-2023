import { ApplicationConfig } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)],

};
