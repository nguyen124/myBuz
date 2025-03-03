import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NodesComponent } from './nodes/nodes.component';
import { NodeRoutingModule } from './nodes-routing.module';
import { DraggableDirective } from '../shared/directive/draggable.directive';
import { CanvasNavigatorDirective } from '../shared/directive/canvasNavigator.directive';
import { NodeComponent } from './node/node.component';
import { MapComponent } from './map/map.component';
import { LineComponent } from './line/line.component';
import { TooltipComponent } from './tooltip/tooltip.component';
import { ShareModule } from '../shared/share/share.module';

@NgModule({
  declarations: [
    NodesComponent,
    DraggableDirective,
    CanvasNavigatorDirective,
    NodeComponent,
    MapComponent,
    LineComponent,
    TooltipComponent
],
  imports: [
    CommonModule,
    ShareModule,
    NodeRoutingModule
  ]
})
export class NodesModule { }
