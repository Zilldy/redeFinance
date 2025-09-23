import { Routes } from '@angular/router';
import { CnpjsList } from './components/cnpjs-list/cnpjs-list';

export const routes: Routes = [
    { path: '', component: CnpjsList },
    { path: '**', redirectTo: '' }
];
