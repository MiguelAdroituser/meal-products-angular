import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404PageComponent } from './shared/pages/error404-page/error404-page.component';
import { IsAuthenticatedGuard } from './auth/guards/is-authenticated.guard';
import { PublicGuard } from './auth/guards/public.guard';

// dominio.com/
const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthModule ),
    canActivate: [ PublicGuard ]
  },
  {
    path: 'meals',
    loadChildren: () => import('./mealproducts/mealproducts.module').then( m => m.MealproductsModule ),
    canActivate: [ IsAuthenticatedGuard ]
  },
  {
    path: '404',
    component: Error404PageComponent
  },
  {
    path: '',
    redirectTo: 'meals',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '404',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
