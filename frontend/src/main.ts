import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import './app/chart.config';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
