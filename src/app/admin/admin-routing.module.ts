import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin/admin.component';

const routes: Routes = [{
  path: 'admin/dashboard',
  component: AdminComponent
}]


@NgModule({
  declarations: [
  ],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class AdminRoutingModule { }
