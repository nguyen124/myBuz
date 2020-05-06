import { Component, OnInit, Input, OnDestroy, Inject, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { CommunicateService } from '../shared/services/utils/communicate.service';
import { IItem } from '../shared/model/item';
import { VoiceMessageServiceService } from '../shared/services/voice-message.service';
import { HttpEventType } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { JQ_TOKEN } from '../shared/services/jQuery.service';
import { SystemService } from '../shared/services/utils/system.service';
import { AuthService } from '../shared/services/security/auth.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { IComment } from '../shared/model/comment';
import { CommentService } from '../shared/services/comment.services';

@Component({
  selector: 'app-comment-box',
  templateUrl: './comment-box.component.html',
  styleUrls: ['./comment-box.component.css']
})
export class CommentBoxComponent implements OnInit, OnDestroy {
  @Input() item: IItem;
  @Input() comment: IComment;
  @Input() isTopCommentBox: boolean;
  @Input() set isShowing(value: boolean) {
    this._isShowing = value;
    setTimeout(() => {
      this.setTextboxFocus();
    }, 0)
  }
  get isShowing() {
    return this._isShowing;
  }
  private _isShowing: boolean;

  @Input() set isEditting(value: boolean) {
    this._isEditting = value;
    if (this.isShowing) {
      if (value) {
        this.populateData();
      } else {
        this.reset();
      }
    }
  }
  get isEditting() {
    return this._isEditting;
  }
  private _isEditting: boolean;

  @Output() commentBoxFocused: EventEmitter<any> = new EventEmitter<any>();
  @Output() editingCommentDone: EventEmitter<IComment> = new EventEmitter<IComment>();
  @ViewChild('txtReplyBox', { static: false }) txtReplyBox: ElementRef;

  isRecording: boolean;
  isUploading: boolean;
  commentType: string = "ItemComment";
  uploadedFile: File;
  voiceRecord: any;
  textContent: string = '';
  picPreviewSrc: any;
  voicePreviewSrc: any;
  commentContent: Array<object> = [];

  constructor(
    private _commSvc: CommunicateService,
    private _voiceSvc: VoiceMessageServiceService,
    private _systemSvc: SystemService,
    private _authSvc: AuthService,
    private _router: Router,
    private _commentSvc: CommentService,
    @Inject(JQ_TOKEN) private $: any,
    private _toastr: ToastrService,
    private _san: DomSanitizer) {
  }

  ngOnInit() {

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
            fileType: "image"
          }
          this.commentContent.push(picObj);
          callback(this);
        }
      }, err => {
        this._toastr.error("Failed to upload data!. Please try again.");
        this.reset();
      })
    } else {
      if (this.picPreviewSrc) {
        var picObj = {
          url: this.picPreviewSrc,
          fileType: "image"
        };
        this.commentContent.push(picObj);
      }
      callback(this);
    }
  }

  _addTextContent() {
    if (this.textContent) {
      var textObj = {
        url: this.textContent,
        filename: '',
        fileType: "text"
      };
      this.commentContent.push(textObj);
    }
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
            fileType: "sound"
          };
          that.commentContent.push(voiceObj);
          thatt._f(that);
        }
      },
        err => {
          thatt._toastr.error("Failed to upload data!. Please try again.");
          thatt.reset();
        });
    } else {
      if (thatt.voicePreviewSrc) {
        var voiceObj = {
          url: thatt.voicePreviewSrc,
          fileType: "sound"
        };
        thatt.commentContent.push(voiceObj);
      }
      thatt._f(that);
    }
  }

  _f(that) {
    if (that.commentContent.length > 0) {
      if (!that.isEditting) {
        var comment = {
          parentCommentId: (that.comment) ? (that.comment.parentCommentId || that.comment._id) : null,
          itemId: that.item._id,
          content: that.commentContent,
          replyTo: that.comment ? {
            _id: that.comment._id,
            content: that.comment.content,
            writtenBy: that.comment.writtenBy
          } : null
        }
        that._commentSvc.addComment(comment).subscribe(newComment => {
          that.afterAddingComment(newComment);
        },
          err => {
            that._toastr.error("Failed to add comment!. Please try again.");
            that.reset();
          });
      } else {
        that._commentSvc.updateComment(that.comment, that.commentContent).subscribe(updatedComment => {
          that.afterEdittingComment(updatedComment);
        },
          err => {
            that._toastr.error("Failed to update comment!. Please try again.");
            that.reset();
          });
      }
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

  clearPreviewPic() {
    this.picPreviewSrc = null;
  }

  afterAddingComment(newComment) {
    this.reset();
    this.setTextboxFocus();
    this.item.noOfComments++;
    this._commSvc.changeComment(newComment);
  }

  setTextboxFocus() {
    if (this.txtReplyBox) {
      this.txtReplyBox.nativeElement.focus();
    }
  }

  reset() {
    this.textContent = '';
    this.commentContent = [];
    this.picPreviewSrc = null;
    this.voicePreviewSrc = null;
    this.uploadedFile = null;
    this.voiceRecord = null;
  }

  populateData() {
    for (var obj of this.comment.content) {
      if (obj.type == 'text' && obj.url.trim()) {
        this.textContent = obj.url;
      } else if (obj.type == 'image') {
        this.picPreviewSrc = obj.url;
      } else if (obj.type == 'sound') {
        this.voicePreviewSrc = obj.url;
      }
    }
  }

  afterEdittingComment(newComment) {
    this.comment = newComment;
    this.editingCommentDone.emit(newComment);
    this.reset();
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
