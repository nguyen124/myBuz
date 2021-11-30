import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-nodes',
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.css']
})
export class NodesComponent implements OnInit {
  nodes: [any];
  from: { top, left, bottom, right } = undefined;
  to: { top, left, bottom, right } = undefined;
  @ViewChild('btn1', { static: false }) btn1: ElementRef;
  @ViewChild('btn2', { static: false }) btn2: ElementRef;
  @ViewChild('connectedLine', { static: false }) connectedLine: ElementRef;
  @ViewChild('outterCanvas', { static: false }) outterCanvas: ElementRef;

  constructor() { }

  onFromValueReceived(value) {
    this.from = value;
    console.log(this.from);
    this.drawLine(this.from, this.to);
  }

  onToValueReceived(value) {
    this.to = value;
    this.drawLine(this.from, this.to);
  }

  handleCanvasMoving(value) {

    this.drawNode(this.btn1, value);
    this.drawNode(this.btn2, value);


    this.drawLine(this.from, this.to, value);
  }

  drawNode(btn, value) {
    btn.nativeElement.style.top = btn.nativeElement.offsetTop + value.top + 'px';
    btn.nativeElement.style.left = btn.nativeElement.offsetLeft + value.left + 'px';
  }

  drawLine(from, to, value?: any) {
    if (value) {
      from.top += value.top;
      from.left += value.left;
      to.top += value.top;
      to.left += value.left;
    }
    const offset = this.outterCanvas.nativeElement.getBoundingClientRect();
    if (this.connectedLine) {
      if (this.from) {
        this.connectedLine.nativeElement.setAttribute('y1', from.top - offset.top + 'px');
        this.connectedLine.nativeElement.setAttribute('x1', from.left - offset.left + 'px');
      }
      if (this.to) {
        this.connectedLine.nativeElement.setAttribute('y2', to.top - offset.top + 'px');
        this.connectedLine.nativeElement.setAttribute('x2', to.left - offset.left + 'px');
      }
    }
  }

  ngOnInit() {
    this.nodes = [
      {
        "files": [
          {
            "url": "https://storage.googleapis.com/m2meme-dev.appspot.com/2021/10/23/haidapchai/Capture.PNG",
            "filename": "2021/10/23/haidapchai/Capture.PNG",
            "fileType": "image/png"
          }
        ],
        "tags": [
          "asd"
        ],
        "categories": [
          "Music"
        ],
        "_id": "619dacaed3771b1324074b1a",
        "title": "asdasd",
        "description": "asdasd",
        "createdBy": {
          "userId": "619d58d26fee6d3edc387f68",
          "avatar": "https://storage.googleapis.com/m2meme-dev.appspot.com/2021/10/23/haidapchai/Capture.PNG",
          "username": "haidapchai"
        },
        "modifiedDate": "2021-11-24T03:08:30.000Z",
        "noOfPoints": 0,
        "noOfComments": 0,
        "__v": 0
      }
    ];
  }

}
