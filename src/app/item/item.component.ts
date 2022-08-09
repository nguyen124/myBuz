import { Component, OnInit, Input, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { IItem } from '../shared/model/item';
import { MemeVideoComponent } from '../meme-video/meme-video.component';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  @Input() item: IItem;
  @Input() baseUrl: string;
  @Input() isShowingTag: boolean; 
  @ViewChildren(MemeVideoComponent) memeVideos: QueryList<MemeVideoComponent>;

  constructor() {
  }

  ngOnInit() {
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

