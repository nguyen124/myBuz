import { Injectable } from '@angular/core';
import * as RecordRTC from 'recordrtc';
import { Subject, Observable } from 'rxjs';
import * as moment from 'moment'
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VoiceMessageServiceService {
  private stream;
  private recorder;
  private interval;
  private startTime;

  private _recordingTime = new Subject<string>();
  private _recordingFailed = new Subject<string>();

  constructor(private _http: HttpClient) { }

  getRecordedTime(): Observable<string> {
    return this._recordingTime.asObservable();
  }

  recordingFailed(): Observable<string> {
    return this._recordingFailed.asObservable();
  }

  private toString(value) {
    let val = value || '00';
    if (value < 10) {
      val = '0' + value;
    }
    return val;
  }

  private stopMedia() {
    if (this.recorder) {
      this.recorder = null;
      clearInterval(this.interval);
      this.startTime = null;
      if (this.stream) {
        this.stream.getAudioTracks().forEach(track => track.stop());
        this.stream = null;
      }
    }
  }

  startRecord() {
    if (this.recorder) {
      // It means recording is already started or it is already recording something
      return;
    }
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      this.stream = stream;

      this._recordingTime.next('00:00');
      this.recorder = new RecordRTC.StereoAudioRecorder(stream, {
        type: 'audio',
        mimeType: 'audio/webm'
      });

      this.recorder.record();
      this.startTime = moment();
      this.interval = setInterval(
        () => {
          const currentTime = moment();
          const diffTime = moment.duration(currentTime.diff(this.startTime));
          const time = this.toString(diffTime.minutes()) + ':' + this.toString(diffTime.seconds());
          this._recordingTime.next(time);
        },
        1000
      );
    }).catch(function (err) {
      this._toastr.error(err.name, err.message);
    });
  }

  async stopRecord() {
    var record = new Promise((resolve, reject) => {
      if (this.recorder) {
        this.recorder.stop((blob) => {
          if (this.startTime) {
            const mp3Name = encodeURIComponent('audio_' + new Date().getTime() + '.mp3');
            this.stopMedia();
            resolve({ blob: blob, title: mp3Name });
          }
        }, () => {
          this.stopMedia();
          this._recordingFailed.next("");
        });
      }
    });
    return record;
  }

  uploadVoiceRecord(record: any): Observable<any> {
    const fd = new FormData();
    fd.append('voice', record.blob, record.title);
    return this._http.post("/svc/files/upload", fd, {
      reportProgress: true,
      observe: 'events'
    });
  }
}
