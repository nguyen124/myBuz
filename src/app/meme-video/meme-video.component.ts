import { Component, OnInit, Input, ElementRef, ViewChild, HostListener } from '@angular/core';

@Component({
  selector: 'app-meme-video',
  templateUrl: './meme-video.component.html',
  styleUrls: ['./meme-video.component.css']
})
export class MemeVideoComponent implements OnInit {
  @Input() link: string;

  @Input() fileType: string;

  @ViewChild('video', { static: true }) video: ElementRef;

  @HostListener('window:scroll', ['$event'])
  handleKeyboardEvent(event) {
    this.checkScroll();
  }

  @Input() customClass: string;

  mouseLeft: boolean;

  constructor() { }

  ngOnInit() {
    const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    if (this.video) {
      this.video.nativeElement.pause();
    }
  }

  checkScroll() {
    if (this.isInMainPage()) {
      if (!this.isVideoInScreen(this.video)) {
        this.video.nativeElement.pause();
      }
    }
  }

  onMouseEnter() {
    this.mouseLeft = false;
    var that = this;
    if (that.video) {
      setTimeout(() => {
        if (!that.mouseLeft) {
          that.video.nativeElement.play();
        }
      }, 500);
    }
  }

  onMouseLeave() {
    this.mouseLeft = true;
  }

  isVideoInScreen(video) {
    if (video) {
      var rect = video.nativeElement.getBoundingClientRect();
      if (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /* or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
      ) {
        return true
      } else {
        return false;
      }
    }
  }

  isInMainPage() {
    return !!this.customClass;
  }

  onEnded() {
    if (this.video) {
      this.video.nativeElement.currentTime = 0;
    }
  }

  pause() {
    if (this.video) {
      this.video.nativeElement.pause();
    }
  }
}
