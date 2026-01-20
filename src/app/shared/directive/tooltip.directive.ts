import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[tooltip-dir]',
    standalone: false
})
export class TooltipDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
