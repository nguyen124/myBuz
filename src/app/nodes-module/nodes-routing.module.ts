import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapComponent } from './map/map.component';
import { NodesComponent } from './nodes/nodes.component';

const routes: Routes = [{
  path: '',
  component: NodesComponent,
},
{
  path: 'map',
  component: MapComponent,
}
]


@NgModule({
  declarations: [
  ],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class NodeRoutingModule { }
