import { Component, OnInit, Input, OnDestroy, Inject } from '@angular/core';
import { CommunicateService } from '../shared/services/utils/communicate.service';
import { IItem } from '../shared/model/item';
import { CommentService } from '../shared/services/comment.services';
import { VoiceMessageServiceService } from '../shared/services/voice-message.service';
import { HttpEventType } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { JQ_TOKEN } from '../shared/services/jQuery.service';

@Component({
  selector: 'app-comment-box',
  templateUrl: './comment-box.component.html',
  styleUrls: ['./comment-box.component.css']
})
export class CommentBoxComponent implements OnInit, OnDestroy {
  @Input()
  item: IItem;
  isRecording: boolean;
  isUploading: boolean;
  commentType: string = "ItemComment";

  constructor(
    private _commentSvc: CommentService,
    private _commSvc: CommunicateService,
    private _voiceSvc: VoiceMessageServiceService,
    @Inject(JQ_TOKEN) private $: any,
    private _toastr: ToastrService) {
  }

  ngOnInit() {
    setTimeout(() => {
      this.$("#txtReplyBox").focus();
    }, 1000);
  }

  writeTextComment() {
    var content = this.$("#txtReplyBox").html();
    if (content) {
      this._commentSvc.addComment(this.item._id, content, null).subscribe(newComment => {
        this.afterCommenting(newComment);
      });
    }
  }

  writeVoiceComment() {
    this.isRecording = !this.isRecording;
    if (this.isRecording) {
      this._voiceSvc.startRecord();
    } else {
      this._voiceSvc.stopRecord().then(record => {
        this._voiceSvc.uploadVoiceRecord(record).subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {
            this._toastr.success('Upload voice comment progress: ' + Math.round(event.loaded / event.total * 100) + "%");
          } else if (event.type === HttpEventType.Response) {
            this._commentSvc.addComment(this.item._id, null, event.body["fileLocation"]).subscribe(newComment => {
              this.afterCommenting(newComment);
            });
          }
        });
      })
    }
  }

  afterCommenting(newComment) {
    this.item.noOfComments++;
    this.$("#txtReplyBox").html("");
    this._commentSvc.parentCommentId = null;// after reply remove parentCommentId
    this._commSvc.changeComment(newComment);
  }

  ngOnDestroy() {
  }
}
