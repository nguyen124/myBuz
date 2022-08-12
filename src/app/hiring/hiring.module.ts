import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HiringItemsComponent } from './hiring-items/hiring-items.component';
import { HiringRoutingModule } from './hiring-routing.module';



@NgModule({
  declarations: [
    HiringItemsComponent
  ],
  imports: [
    CommonModule,
    HiringRoutingModule
  ]
})
export class HiringModule { }
