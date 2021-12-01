import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  nodes: any;
  from: { top: number, left: number, bottom: number, right: number } = undefined;
  to: { top: number, left: number, bottom: number, right: number }[] = [];
  canvasCoor: { top: number, left: number };

  @ViewChildren('neighbors') neighbors: QueryList<ElementRef>;
  @ViewChildren('connectedLines') connectedLines: QueryList<ElementRef>;
  @ViewChild('outterCanvas', { static: false }) outterCanvas: ElementRef;
  constructor() { }

  onToValueReceived(value: { top: number, left: number, bottom: number, right: number }, index: number) {
    this.to[index] = value;
    this.drawLine(this.from, index);
  }

  handleCanvasMoving(value) {
    this.canvasCoor = value;
    // this.drawNode(this.root, value);
    // this.neighbors.forEach(neighbor => {
    //   this.drawNode(neighbor, value);
    // });

    // this.drawLineToNeighbors(this.from, this.to, value);
  }

  drawNode(btn, value) {
    btn.nativeElement.style.top = btn.nativeElement.offsetTop + value.top + 'px';
    btn.nativeElement.style.left = btn.nativeElement.offsetLeft + value.left + 'px';
  }

  drawLine(from, index) {
    const offset = this.outterCanvas ? this.outterCanvas.nativeElement.getBoundingClientRect() : { top: 0, left: 0 };
    if (this.connectedLines) {
      this.connectedLines.forEach((connectedLine, idx) => {
        if (idx === index) {
          if (from) {
            connectedLine.nativeElement.setAttribute('y1', from.top - offset.top + 'px');
            connectedLine.nativeElement.setAttribute('x1', from.left - offset.left + 'px');
          }
          if (this.to[index]) {
            connectedLine.nativeElement.setAttribute('y2', this.to[index].top - offset.top + 'px');
            connectedLine.nativeElement.setAttribute('x2', this.to[index].left - offset.left + 'px');
          }
        }
      });
    }
  }

  drawLineToNeighbors(from, to, value?) {
    if (value) {
      from.top += value.top;
      from.left += value.left;
      for (const t of this.to) {
        t.top += value.top;
        t.left += value.left;
      }
    }
    const offset = this.outterCanvas ? this.outterCanvas.nativeElement.getBoundingClientRect() : { top: 0, left: 0 };
    if (this.connectedLines) {
      this.connectedLines.forEach((connectedLine, idx) => {
        if (from) {
          connectedLine.nativeElement.setAttribute('y1', from.top - offset.top + 'px');
          connectedLine.nativeElement.setAttribute('x1', from.left - offset.left + 'px');
        }
        if (to[idx]) {
          connectedLine.nativeElement.setAttribute('y2', to[idx].top - offset.top + 'px');
          connectedLine.nativeElement.setAttribute('x2', to[idx].left - offset.left + 'px');
        }
      });
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
        "_id": "1",
        "title": "Main",
        "description": "Main",
        "createdBy": {
          "userId": "619d58d26fee6d3edc387f68",
          "avatar": "https://storage.googleapis.com/m2meme-dev.appspot.com/2021/10/23/haidapchai/Capture.PNG",
          "username": "haidapchai"
        },
        "modifiedDate": "2021-11-24T03:08:30.000Z",
        "noOfPoints": 0,
        "noOfComments": 0,
        "__v": 0,
        "coordinates": {
          "top": 100,
          "left": 110
        },
        "neighbors": [
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
            "_id": "2",
            "title": "Neighbor1",
            "description": "Neighbor1",
            "createdBy": {
              "userId": "619d58d26fee6d3edc387f68",
              "avatar": "https://storage.googleapis.com/m2meme-dev.appspot.com/2021/10/23/haidapchai/Capture.PNG",
              "username": "haidapchai"
            },
            "modifiedDate": "2021-11-24T03:08:30.000Z",
            "noOfPoints": 0,
            "noOfComments": 0,
            "__v": 0,
            "coordinates": {
              "top": 300,
              "left": 300
            },
            "neighbors": [],
          },
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
            "_id": "3",
            "title": "Neighbor2",
            "description": "Neighbor2",
            "createdBy": {
              "userId": "619d58d26fee6d3edc387f68",
              "avatar": "https://storage.googleapis.com/m2meme-dev.appspot.com/2021/10/23/haidapchai/Capture.PNG",
              "username": "haidapchai"
            },
            "modifiedDate": "2021-11-24T03:08:30.000Z",
            "noOfPoints": 0,
            "noOfComments": 0,
            "__v": 0,
            "coordinates": {
              "top": 100,
              "left": 400
            },
            "neighbors": [],
          }
        ]
      },
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
        "_id": "2",
        "title": "Main2",
        "description": "Main2",
        "createdBy": {
          "userId": "619d58d26fee6d3edc387f68",
          "avatar": "https://storage.googleapis.com/m2meme-dev.appspot.com/2021/10/23/haidapchai/Capture.PNG",
          "username": "haidapchai"
        },
        "modifiedDate": "2021-11-24T03:08:30.000Z",
        "noOfPoints": 0,
        "noOfComments": 0,
        "__v": 0,
        "coordinates": {
          "top": 700,
          "left": 110
        },
        "neighbors": [
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
            "_id": "4",
            "title": "Neighbor21",
            "description": "Neighbor21",
            "createdBy": {
              "userId": "619d58d26fee6d3edc387f68",
              "avatar": "https://storage.googleapis.com/m2meme-dev.appspot.com/2021/10/23/haidapchai/Capture.PNG",
              "username": "haidapchai"
            },
            "modifiedDate": "2021-11-24T03:08:30.000Z",
            "noOfPoints": 0,
            "noOfComments": 0,
            "__v": 0,
            "coordinates": {
              "top": 500,
              "left": 300
            },
            "neighbors": [],
          },
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
            "_id": "5",
            "title": "Neighbor22",
            "description": "Neighbor22",
            "createdBy": {
              "userId": "619d58d26fee6d3edc387f68",
              "avatar": "https://storage.googleapis.com/m2meme-dev.appspot.com/2021/10/23/haidapchai/Capture.PNG",
              "username": "haidapchai"
            },
            "modifiedDate": "2021-11-24T03:08:30.000Z",
            "noOfPoints": 0,
            "noOfComments": 0,
            "__v": 0,
            "coordinates": {
              "top": 600,
              "left": 400
            },
            "neighbors": [],
          }
        ]
      }
    ];
  }

}
