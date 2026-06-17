import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { DashboardComponent } from './components/dashboard/dashboard';
import { ProductosComponent } from './components/productos/productos';
import { CategoriasComponent } from './components/categorias/categorias';
import { MovimientosComponent } from './components/movimientos/movimientos';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'productos', component: ProductosComponent, canActivate: [authGuard] },
  { path: 'categorias', component: CategoriasComponent, canActivate: [authGuard] },
  { path: 'movimientos', component: MovimientosComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];
