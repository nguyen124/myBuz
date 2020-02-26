import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-reply-to',
  templateUrl: './reply-to.component.html'
})
export class ReplyToComponent implements OnInit {
  @Input() replyToUsername: string = '';
  constructor() { }

  ngOnInit() {
  }
}
