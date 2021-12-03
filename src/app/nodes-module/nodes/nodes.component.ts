import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-nodes',
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.css']
})
export class NodesComponent implements OnInit {
  nodes: any;
  from: { top: number, left: number, bottom: number, right: number } = undefined;
  to: { top: number, left: number, bottom: number, right: number }[] = [];
  canvasCoor: { top: number, left: number };

  @ViewChildren('neighbors') neighbors: QueryList<ElementRef>;

  @ViewChild('outterCanvas', { static: false }) outterCanvas: ElementRef;
  constructor() { }


  handleCanvasMoving(value) {
    this.canvasCoor = value;
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
        "category": "Music",
        "_id": "1",
        "title": "Root",
        "description": "Root",
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
          "left": 100
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
            "category": [
              "Sport"
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
              "top": 100,
              "left": 250
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
            "category": "Anime",
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
              "top": 300,
              "left": 100
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
                "category": "Movie",
                "_id": "6",
                "title": "Neighbor6",
                "description": "Neighbor6",
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
                  "top": 430,
                  "left": 100
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
                "category": "Anime",
                "_id": "7",
                "title": "Neighbor7",
                "description": "Neighbor7",
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
                  "left": 350
                },
                "neighbors": [],
              }
            ],
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
        "category": "Book",
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
          "top": 100,
          "left": 250
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
            "category": "Fashion",
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
              "top": 200,
              "left": 250
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
            "category": "Cosmetic",
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
              "top": 100,
              "left": 400
            },
            "neighbors": [],
          }
        ]
      }
    ];
    this.bfs(this.nodes);
  }

  nodesToShow = [];
  linesToShow = [];
  theStartNodes = {};
  bfs(nodes: any) {
    var visited = {};
    for (var n of nodes) {
      var queue = [];
      var start = 0;
      var size = 0;
      queue.push(n);
      size = queue.length;

      while (size > 0) {
        var node = queue[start];
        if (!visited[node._id]) {
          this.visit(visited, node);
          this.theStartNodes[node._id] = node;
        }
        start++;
        size--;
        for (var childNode of node.neighbors) {
          if (!visited[childNode._id]) {
            queue.push(childNode);
            this.linesToShow.push({ start: this.theStartNodes[node._id], end: childNode });
            size++;
          }
        }
      }
    }
  }

  visit(visited, node) {
    visited[node._id] = true;
    this.nodesToShow.push(node);    
  }
}
