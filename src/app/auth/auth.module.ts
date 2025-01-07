import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { AuthRoutingModule } from './auth-routing.module';

/* FontAwesome are not being used yet */
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSave, faUser, } from '@fortawesome/free-solid-svg-icons';
import { ReactiveFormsModule } from '@angular/forms';

library.add( faSave, faUser );

@NgModule({
  declarations: [
    LayoutPageComponent,
    LoginPageComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,

    FontAwesomeModule
  ]
})
export class AuthModule { }
