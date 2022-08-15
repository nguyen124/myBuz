import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ParentAuthGuard } from '../shared/guard/parentGuard';
import { HiringItemsComponent } from './hiring-items/hiring-items.component';
import { UploadHiringComponent } from './upload-hiring/upload-hiring.component';

const routes: Routes = [
  { path: '', component: HiringItemsComponent },
  { path: 'post', component: UploadHiringComponent, canActivate: [ParentAuthGuard] },
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
