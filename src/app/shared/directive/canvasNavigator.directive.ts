import { AfterViewInit, Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
import { Observable, of } from 'rxjs';
import { flatMap, map, pairwise, switchMap, takeUntil } from 'rxjs/operators';

@Directive({
    selector: '[canvasNavigator]',
    standalone: false
})
export class CanvasNavigatorDirective implements AfterViewInit {

  mouseup = new EventEmitter<MouseEvent>();
  mousedown = new EventEmitter<MouseEvent>();
  mousemove = new EventEmitter<MouseEvent>();

  mousedrag: Observable<{ top: number, left: number }>;
  @Output() outterCanvasXYEmitter: EventEmitter<{ top: number, left: number }> = new EventEmitter<{ top: number, left: number }>();

  @HostListener('mouseup', ['$event'])
  onMouseup(event: MouseEvent) {
    this.mouseup.emit(event);
  }

  @HostListener('mousedown', ['$event'])
  onMousedown(event: MouseEvent) {
    this.mousedown.emit(event);
    return false;
  }

  @HostListener('mousemove', ['$event'])
  onMousemove(event: MouseEvent) {
    this.mousemove.emit(event);
  }

  constructor(public element: ElementRef) {
    this.element.nativeElement.style.cursor = 'move';

    this.mousedrag = this.mousedown.pipe(
      map((event) => {
        return {
          top: event.clientY,
          left: event.clientX
        };
      }),
      flatMap(
        (mouseFirstDownPos) => this.mousemove.pipe(map((pos: any) => ({
          top: pos.clientY - mouseFirstDownPos.top,
          left: pos.clientX - mouseFirstDownPos.left
        })),
          pairwise(),
          switchMap(([oldResult, newResult]) => {
            return of({
              top: newResult.top - oldResult.top,
              left: newResult.left - oldResult.left
            })
          }),
          takeUntil(this.mouseup))
      ));
  }

  ngAfterViewInit() {
    this.mousedrag.subscribe({
      next: (pos) => {
        this.outterCanvasXYEmitter.emit({ top: pos.top, left: pos.left });
      }
    });
  }
}