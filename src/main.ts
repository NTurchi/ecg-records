import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { environment } from './environments/environment';

async function enabledAPIMocking() {
  if (!environment.isDev) {
    return Promise.resolve();
  }

  console.log('[Dev] Enable Mock API');
  const { worker } = await import('./mocks/browser');
  return worker.start({ onUnhandledRequest: 'bypass' });
}

enabledAPIMocking().then(() =>
  bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err))
);
