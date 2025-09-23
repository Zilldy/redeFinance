import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import './app/chart.config'; // garante que os elementos ficam globais

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
