import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NodesComponent } from './nodes/nodes.component';
import { NodeRoutingModule } from './nodes-routing.module';
import { DraggableDirective } from '../shared/directive/draggable.directive';
import { CanvasNavigatorDirective } from '../shared/directive/canvasNavigator.directive';
@NgModule({
  declarations: [NodesComponent, DraggableDirective, CanvasNavigatorDirective],
  imports: [
    CommonModule,
    NodeRoutingModule
  ]
})
export class NodesModule { }
