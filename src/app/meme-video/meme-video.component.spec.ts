import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MemeVideoComponent } from './meme-video.component';

describe('MemeVideoComponent', () => {
  let component: MemeVideoComponent;
  let fixture: ComponentFixture<MemeVideoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MemeVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemeVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
