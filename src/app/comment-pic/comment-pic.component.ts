import { Component, OnInit, Input, Inject } from '@angular/core';
import { JQ_TOKEN } from '../shared/services/jQuery.service';

@Component({
  selector: 'app-comment-pic',
  templateUrl: './comment-pic.component.html',
  styleUrls: ['./comment-pic.component.css']
})
export class CommentPicComponent implements OnInit {

  @Input() previewPicSrc;
  @Input() showCloseBtn: boolean;
  constructor(@Inject(JQ_TOKEN) private $: any) { }

  ngOnInit() {
  }

  removePreviewPic() {
    this.previewPicSrc = null;
  }
}
