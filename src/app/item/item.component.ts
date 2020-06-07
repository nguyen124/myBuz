import { Component, OnInit, Input, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { IItem } from '../shared/model/item';
import { MemeVideoComponent } from '../meme-video/meme-video.component';
import { MetaTagService } from '../shared/services/meta-tag.services';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  @Input() item: IItem;
  @Input() baseUrl: string;
  @Input() isShowingTag: boolean;
  @Output() showModalEvent: EventEmitter<any> = new EventEmitter<any>();
  @ViewChildren(MemeVideoComponent) memeVideos: QueryList<MemeVideoComponent>;
  constructor(private _activatedRoute: ActivatedRoute, private titleTagService: MetaTagService) {

  }

  onClickTitle() {
    window.location.href = "/svc/metatags?id=" + this.item._id;
  }

  ngOnInit() {
    this._activatedRoute.queryParams.subscribe(params => {
      if (params.id) {
        this.titleTagService.setTitle(this.item.title);
        this.titleTagService.setSocialMediaTags(
          "https://me2meme.com/items?id=" + this.item._id,
          this.item.title,
          this.item.description,
          this.getThumbNailImage());
      }
    });
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

  showItemModal() {
    this.showModalEvent.emit();
  }

  getThumbNailImage() {
    if (this.item && this.item.files && this.item.files.length > 0) {
      var fileType = this.item.files[0].fileType;
      if (fileType.startsWith("video")) {
        return this.getPoster(this.item.files[0].url);
      } else if (fileType.startsWith("image")) {
        return this.item.files[0].url;
      }
    }
    return "https://me2meme.com/assets/image/logo256x215.png";
  }

  getPoster(url) {
    return url.replace(/\.[^.]+$/, "_poster.jpg");
  }
}

