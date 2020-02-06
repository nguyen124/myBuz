import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-comment-voice',
  templateUrl: './comment-voice.component.html',
  styleUrls: ['./comment-voice.component.css']
})
export class CommentVoiceComponent implements OnInit {
  @Input() voicePreviewSrc: any = null;
  @Input() showCloseBtn: boolean;
  constructor() { }

  ngOnInit() {
  }

  removePreviewVoice() {
    this.voicePreviewSrc = null;
  }
}
