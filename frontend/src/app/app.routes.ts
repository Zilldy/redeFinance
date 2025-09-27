import { Routes } from '@angular/router';
import { CnpjsList } from './components/cnpjs-list/cnpjs-list';
import { CnpjDetailComponent } from './components/cnpj-detail/cnpj-detail';

export const routes: Routes = [
    { path: '', component: CnpjsList },
    {
        path: 'empresa/:cnpj',
        loadComponent: () =>
            import('./components/cnpj-detail/cnpj-detail').then(
            (m) => m.CnpjDetailComponent
            ),
        },
    { path: '**', redirectTo: '' },
];
