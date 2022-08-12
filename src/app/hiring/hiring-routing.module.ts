import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HiringItemsComponent } from './hiring-items/hiring-items.component';

const routes: Routes = [
  {
    path: '',
    component: HiringItemsComponent
  }
]
@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class HiringRoutingModule { }
