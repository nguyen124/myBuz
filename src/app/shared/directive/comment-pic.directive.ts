import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[comment-pic]'
})
export class CommentPicDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
