import { Component, OnInit, Input, OnDestroy, Inject, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { CommunicateService } from '../shared/services/utils/communicate.service';
import { IItem } from '../shared/model/item';
import { CommentService } from '../shared/services/comment.services';
import { VoiceMessageServiceService } from '../shared/services/voice-message.service';
import { HttpEventType } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { JQ_TOKEN } from '../shared/services/jQuery.service';
import { SystemService } from '../shared/services/utils/system.service';
import { AuthService } from '../shared/services/security/auth.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { IComment } from '../shared/model/comment';

@Component({
  selector: 'app-comment-box',
  templateUrl: './comment-box.component.html',
  styleUrls: ['./comment-box.component.css']
})
export class CommentBoxComponent implements OnInit, OnDestroy {
  @Input() item: IItem;
  @Input() comment: IComment;
  @Input() isTopCommentBox: boolean;
  @Input() isShowing: boolean;
  @Output() commentBoxFocused: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('txtReplyBox', { static: false }) txtReplyBox: ElementRef;

  isRecording: boolean;
  isUploading: boolean;
  commentType: string = "ItemComment";
  uploadedFile: File;
  voiceRecord: any;
  textContent: string = '';
  replyToUsername: string = '';
  picPreviewSrc: any;
  voicePreviewSrc: any;
  commentContent: Array<object> = [];

  constructor(
    private _commentSvc: CommentService,
    private _commSvc: CommunicateService,
    private _voiceSvc: VoiceMessageServiceService,
    private _systemSvc: SystemService,
    private _authSvc: AuthService,
    private _router: Router,
    @Inject(JQ_TOKEN) private $: any,
    private _toastr: ToastrService,
    private _san: DomSanitizer) {
  }

  ngOnInit() {
    this.replyToUsername = this.comment ? this.comment.writtenBy['username'] : '';
    // setTimeout(() => {
    //   if (this.txtReplyBox) {
    //     this.txtReplyBox.nativeElement.focus();
    //   }
    // }, 1000);
  }

  writeTextComment() {
    if (this._authSvc.isLoggedIn()) {
      var that = this;
      that._uploadPic(that._uploadVoice);
    } else {
      this.closeModal();
      this._router.navigate(['login']);
    }
  }

  closeModal() {
    var modalDismiss = this.$("#closeModalBtn");
    if (modalDismiss && modalDismiss[0]) { modalDismiss.click(); }
  }

  _uploadPic(callback) {
    this._addTextContent();
    if (this.uploadedFile) {
      this._systemSvc.uploadFile(this.uploadedFile).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this._toastr.success('Upload Progress: ' + Math.round(event.loaded / event.total * 100) + "%");
        } else if (event.type === HttpEventType.Response) {
          var picObj = {
            url: event.body["fileLocation"],
            filename: event.body["filename"],
            type: "image"
          }
          this.commentContent.push(picObj);
          callback(this);
        }
      }, err => {
        this._toastr.error("Failed to upload image!. Please try again later.")
      })
    } else {
      callback(this);
    }
  }

  _addTextContent() {
    var textObj = {
      type: "text",
      content: this.textContent,
      replyTo: this.comment ? this.comment.writtenBy : null
    };
    this.commentContent.push(textObj);
  }

  _uploadVoice(that) {
    var thatt = that;
    if (that.voiceRecord) {
      that._voiceSvc.uploadVoiceRecord(that.voiceRecord).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          that._toastr.success('Upload voice comment progress: ' + Math.round(event.loaded / event.total * 100) + "%");
        } else if (event.type === HttpEventType.Response) {
          var voiceObj = {
            url: event.body["fileLocation"],
            filename: event.body["filename"],
            type: "sound"
          };
          that.commentContent.push(voiceObj);
          thatt._f(that);
        }
      });
    } else {
      thatt._f(that);
    }
  }

  _f(that) {
    if (that.commentContent.length > 0) {
      if (!that._commentSvc.edittingComment) {
        var comment = {
          parentCommentId: (this.comment) ? (this.comment.parentCommentId || this.comment._id) : null,
          itemId: this.item._id,
          content: that.commentContent
        }
        that._commentSvc.addComment(comment).subscribe(newComment => {
          that.afterAddingComment(newComment);
        });
      }
      // else {
      //   if (that._commentSvc.edittingComment.content !== content) {
      //     that._commentSvc.updateComment(that._commentSvc.edittingComment, content).subscribe(newComment => {
      //       that.afterEdittingComment(newComment)
      //     });
      //   } else {
      //     this.txtReplyBox.nativeElement.innerText = '';
      //   }
      // }
    } else {
      that._toastr.warning("Please enter non-empty comment!")
    }
  }

  @ViewChild('picComment', { static: false }) picComment: ElementRef;
  picCommentPreview() {
    if (this._authSvc.isLoggedIn()) {
      if (this.isTopCommentBox) {
        this.commentBoxFocused.emit("top");
      }
      this.picComment.nativeElement.click();
    } else {
      this.closeModal();
      this._router.navigate(['login']);
    }
  }

  voiceCommentPreview() {
    if (this._authSvc.isLoggedIn()) {
      if (this.isTopCommentBox) {
        this.commentBoxFocused.emit("top");
      }
      this.isRecording = !this.isRecording;
      if (this.isRecording) {
        this._voiceSvc.startRecord();
        this.voicePreviewSrc = null;
      } else {
        this._voiceSvc.stopRecord().then(record => {
          this.voiceRecord = record;
          var blob = window.URL || window["webkitURL"];
          if (!blob) {
            this._toastr.error('Your browser does not support Blob URLs');
            return;
          }
          this.voicePreviewSrc = this._san.bypassSecurityTrustResourceUrl(blob.createObjectURL(<File>record["blob"]));
        })
      }
    } else {
      this.closeModal();
      this._router.navigate(['login']);
    }
  }

  changeValue(event) {
    if (event && event.currentTarget && event.currentTarget.files) {
      var that = this;
      this.uploadedFile = <File>event.currentTarget.files.item(0);
      if (this.uploadedFile) {
        var reader = new FileReader();
        reader.onload = function (e) {
          that.picPreviewSrc = e.target["result"];
        }
        reader.readAsDataURL(this.uploadedFile);
      }
    }
  }

  clearValue(event) {
    this.picPreviewSrc = null;
    //event.currentTarget.value = null;
  }

  afterAddingComment(newComment) {
    this.reset();
    this.txtReplyBox.nativeElement.focus();
    this.item.noOfComments++;
    this._commSvc.changeComment(newComment);
    this.uploadedFile = null;
    this.voiceRecord = null;
    this._commentSvc.edittingComment = null;
  }

  reset() {
    this.textContent = '';
    this.commentContent = [];
    this.picPreviewSrc = null;
    this.voicePreviewSrc = null;
  }

  afterEdittingComment(newComment) {
    this.uploadedFile = null;
    this.voiceRecord = null;
    this._commSvc.changeComment(newComment);
  }

  handleOnFocus() {
    if (this.isTopCommentBox) {
      this.commentBoxFocused.emit("top");
    }
  }

  removePreviewPic() {
    this.picPreviewSrc = null;
    this.uploadedFile = null;
  }

  removePreviewVoice() {
    this.voicePreviewSrc = null;
    this.voiceRecord = null;
  }

  ngOnDestroy() {
  }
}
