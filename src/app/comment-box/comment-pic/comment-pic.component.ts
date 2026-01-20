import { Component, OnInit, Input, Inject } from '@angular/core';
import { JQ_TOKEN } from '../../shared/services/jQuery.service';

@Component({
    selector: 'app-comment-pic',
    templateUrl: './comment-pic.component.html',
    styleUrls: ['./comment-pic.component.css'],
    standalone: false
})
export class CommentPicComponent implements OnInit {
  @Input() picPreviewSrc: any;

  constructor() { }

  ngOnInit() {
  }
}
