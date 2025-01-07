import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MealproductsRoutingModule } from './mealproducts-routing.module';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    LayoutPageComponent,
    ListPageComponent
  ],
  imports: [
    CommonModule,
    MealproductsRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class MealproductsModule { }
