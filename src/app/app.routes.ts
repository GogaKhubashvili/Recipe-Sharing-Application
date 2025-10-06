import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./components/recipe-list/recipe-list.component').then((m) => m.RecipeListComponent),
  },
  {
    path: 'recipes/new',
    loadComponent: () =>
      import('./components/recipe-form/recipe-form.component').then((m) => m.RecipeFormComponent),
  },
  {
    path: 'recipes/:id/edit',
    loadComponent: () =>
      import('./components/recipe-form/recipe-form.component').then((m) => m.RecipeFormComponent),
  },
  {
    path: 'recipes/:id',
    loadComponent: () =>
      import('./components/recipe-detail/recipe-detail.component').then(
        (m) => m.RecipeDetailComponent
      ),
  },
  {
    path: '404',
    loadComponent: () =>
      import('./components/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
  { path: '**', redirectTo: '/404' },
];
