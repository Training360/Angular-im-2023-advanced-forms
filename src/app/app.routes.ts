import { Routes } from '@angular/router';
import { authGuard } from './guard/auth.guard';
import { ForbiddenComponent } from './page/forbidden/forbidden.component';
import { roleGuard } from './guard/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./page/dashboard/dashboard.component').then(
      m => m.DashboardComponent
    ),
    canActivate: [authGuard],
    data: {
      preload: true,
    },
  },
  {
    path: 'dashboard',
    redirectTo: '',
  },
  {
    path: 'products',
    loadComponent: () => import('./page/product/product.component').then(
      m => m.ProductComponent
    ),
    canActivate: [authGuard],
    data: {
      preload: true,
    },
  },
  {
    path: 'product/edit/:id',
    loadComponent: () => import('./page/product-editor/product-editor.component').then(
      m => m.ProductEditorComponent
    ),
    canActivate: [authGuard],
  },
  {
    path: 'customers',
    loadComponent: () => import('./page/customer/customer.component').then(
      m => m.CustomerComponent
    ),
    canActivate: [
      authGuard,
      roleGuard,
    ],
    data: {
      role: 2,
    },
  },
  {
    path: 'customer/edit/:id',
    loadComponent: () => import('./page/customer-editor/customer-editor.component').then(
      m => m.CustomerEditorComponent
    ),
    canActivate: [
      authGuard,
      roleGuard,
    ],
    data: {
      role: 1,
    },
  },
  {
    path: 'customer/add',
    loadComponent: () => import('./page/customer-add/customer-add.component').then(
      m => m.CustomerAddComponent
    ),
    canActivate: [
      authGuard,
      roleGuard,
    ],
    data: {
      role: 1,
    },
  },
  {
    path: 'login',
    loadComponent: () => import('./page/login/login.component').then(
      m => m.LoginComponent
    ),
  },
  {
    path: 'forbidden',
    component: ForbiddenComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
