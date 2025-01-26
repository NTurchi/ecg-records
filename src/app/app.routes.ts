import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '**',
    redirectTo: 'ecgs',
  },
  {
    path: 'ecgs',
    loadComponent: () => import('../features').then(features => features.EcgsComponent),
  },
];
