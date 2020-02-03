import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserHomeComponent } from './user-home/user-home.component';

const routes: Routes = [
  {
    path: 'user/profile',
    component: UserHomeComponent
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
export class UsersRoutingModule { }
