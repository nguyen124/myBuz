import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[tooltip-dir]'
})
export class TooltipDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
