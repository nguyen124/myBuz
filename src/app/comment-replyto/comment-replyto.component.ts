import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-comment-replyto',
  templateUrl: './comment-replyto.component.html',
  styleUrls: ['./comment-replyto.component.css']
})
export class CommentReplytoComponent implements OnInit {
  @Input() personName : string;

  constructor() { }

  ngOnInit() {
  }

}
