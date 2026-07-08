import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'cartoes',
    loadComponent: () =>
      import('./features/cartoes/cartoes-list.component').then((m) => m.CartoesListComponent),
  },
  {
    path: 'categorias',
    loadComponent: () =>
      import('./features/categorias/categorias-list.component').then((m) => m.CategoriasListComponent),
  },
  {
    path: 'compras',
    loadComponent: () =>
      import('./features/compras/compras-list.component').then((m) => m.ComprasListComponent),
  },
  {
    path: 'gastos-recorrentes',
    loadComponent: () =>
      import('./features/gastos-recorrentes/gastos-recorrentes-list.component').then(
        (m) => m.GastosRecorrentesListComponent,
      ),
  },
  {
    path: 'receitas',
    loadComponent: () =>
      import('./features/receitas/receitas-list.component').then((m) => m.ReceitasListComponent),
  },
  {
    path: 'gastos-compartilhados',
    loadComponent: () =>
      import('./features/gastos-compartilhados/gastos-compartilhados-list.component').then(
        (m) => m.GastosCompartilhadosListComponent,
      ),
  },
  { path: '**', redirectTo: 'dashboard' },
];
