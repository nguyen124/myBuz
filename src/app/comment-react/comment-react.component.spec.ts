import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentReactComponent } from './comment-react.component';

describe('CommentReactComponent', () => {
  let component: CommentReactComponent;
  let fixture: ComponentFixture<CommentReactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentReactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentReactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
