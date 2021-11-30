import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NodesComponent } from './nodes/nodes.component';

const routes: Routes = [{
  path: '',
  component: NodesComponent
}]


@NgModule({
  declarations: [
  ],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class NodeRoutingModule { }
