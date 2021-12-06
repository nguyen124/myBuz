import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CommentBoxComponent } from './comment-box.component';

describe('CommentBoxComponent', () => {
  let component: CommentBoxComponent;
  let fixture: ComponentFixture<CommentBoxComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
