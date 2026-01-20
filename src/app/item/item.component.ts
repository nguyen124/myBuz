import { Component, Input, ViewChildren, QueryList } from '@angular/core';
import { IItem } from '../shared/model/item';
import { MemeVideoComponent } from '../meme-video/meme-video.component';

@Component({
    selector: 'app-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.css'],
    standalone: false
})
export class ItemComponent {
  @Input() item: IItem;  
  @Input() showExpired: boolean = false;
  @ViewChildren(MemeVideoComponent) memeVideos: QueryList<MemeVideoComponent>;

  constructor() {
  }

  pause() {
    setTimeout(() => {
      this.memeVideos.forEach((el, idx) => {
        if (el) {
          el.pause();
        }
      });
    }, 500);
  }
}

