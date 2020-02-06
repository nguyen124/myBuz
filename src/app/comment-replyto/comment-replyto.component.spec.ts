import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentReplytoComponent } from './comment-replyto.component';

describe('CommentReplytoComponent', () => {
  let component: CommentReplytoComponent;
  let fixture: ComponentFixture<CommentReplytoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentReplytoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentReplytoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
