import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentPicComponent } from './comment-pic.component';

describe('CommentPicComponent', () => {
  let component: CommentPicComponent;
  let fixture: ComponentFixture<CommentPicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CommentPicComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentPicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
