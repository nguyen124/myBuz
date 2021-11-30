import { AfterViewInit, Directive, ElementRef, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { post } from 'jquery';
import { Observable } from 'rxjs';
import { flatMap, map, takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[myDraggable]'
})
export class DraggableDirective implements OnInit, AfterViewInit {

  mouseup = new EventEmitter<MouseEvent>();
  mousedown = new EventEmitter<MouseEvent>();
  mousemove = new EventEmitter<MouseEvent>();

  mousedrag: Observable<{ top: number, left: number, bottom: number, right: number }>;
  boundingRect: { top: number, left: number, bottom: number, right: number };

  @Output() xyEmitter: EventEmitter<{ top: number, left: number, bottom: number, right: number }> = new EventEmitter<{ top: number, left: number, bottom: number, right: number }>();

  @HostListener('document:mouseup', ['$event'])
  onMouseup(event: MouseEvent) {
    this.mouseup.emit(event);
    event.stopPropagation();
  }

  @HostListener('mousedown', ['$event'])
  onMousedown(event: MouseEvent) {
    this.mousedown.emit(event);
    event.stopPropagation();
    return false; // Call preventDefault() on the event
  }

  @HostListener('document:mousemove', ['$event'])
  onMousemove(event: MouseEvent) {
    this.mousemove.emit(event);
    event.stopPropagation();
  }

  constructor(public element: ElementRef) {
    this.element.nativeElement.style.position = 'absolute';
    this.element.nativeElement.style.cursor = 'pointer';

    this.mousedrag = this.mousedown.pipe(
      map(event => {
        return {
          top: event.clientY - this.element.nativeElement.getBoundingClientRect().top,
          left: event.clientX - this.element.nativeElement.getBoundingClientRect().left,
          bottom: event.clientY - this.element.nativeElement.getBoundingClientRect().bottom,
          right: event.clientX - this.element.nativeElement.getBoundingClientRect().right,
        };
      }),
      flatMap(
        imageOffset => this.mousemove.pipe(map((pos: any) => ({
          top: pos.clientY - imageOffset.top,
          left: pos.clientX - imageOffset.left,
          bottom: pos.clientY - imageOffset.bottom,
          right: pos.clientX - imageOffset.right,
        })),
          takeUntil(this.mouseup))
      ));
  }

  ngOnInit() {
    this.mousedrag.subscribe({
      next: pos => {
        this.element.nativeElement.style.top = pos.top + 'px';
        this.element.nativeElement.style.left = pos.left + 'px';
        this.xyEmitter.emit({
          top: pos.top,
          left: pos.left,
          bottom: pos.bottom,
          right: pos.right
        });
      }
    });
  }

  ngAfterViewInit() {
    this.boundingRect = {
      top: this.element.nativeElement.getBoundingClientRect().top,
      left: this.element.nativeElement.getBoundingClientRect().left,
      bottom: this.element.nativeElement.getBoundingClientRect().bottom,
      right: this.element.nativeElement.getBoundingClientRect().right
    };
    this.xyEmitter.emit({
      top: this.boundingRect.top,
      left: this.boundingRect.left,
      bottom: this.boundingRect.bottom,
      right: this.boundingRect.right
    });
  }
}