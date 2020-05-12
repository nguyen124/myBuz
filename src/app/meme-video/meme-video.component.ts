import { Component, OnInit, Input, ElementRef, ViewChild, HostListener } from '@angular/core';

@Component({
  selector: 'app-meme-video',
  templateUrl: './meme-video.component.html',
  styleUrls: ['./meme-video.component.css']
})
export class MemeVideoComponent implements OnInit {
  @Input()
  link: string;
  @Input()
  fileType: string;
  @ViewChild('video', { static: false }) video: ElementRef;
  @HostListener('window:scroll', ['$event'])
  handleKeyboardEvent(event) {
    console.log("scoll event")
    this.checkScroll();
  }
  constructor() { }

  ngOnInit() {
  }

  checkScroll() {
    const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    if (this.video) {
      var rect = this.video.nativeElement.getBoundingClientRect();
      if (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /* or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
      ) {
        if (vw > 768) {
          this.video.nativeElement.play();
        }
      } else {
        this.video.nativeElement.pause();
      }
    }
  }

  onEnded() {
    this.video.nativeElement.currentTime = 0;
  }
}
