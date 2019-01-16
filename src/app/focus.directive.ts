import { Directive, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[appFocus]'
})
export class FocusDirective {
  @Input() focus: boolean;

  constructor(private element: ElementRef) { }

  ngAfterViewInit() {
    if (this.focus) {
      this.element.nativeElement.focus();
    }
  }
}
