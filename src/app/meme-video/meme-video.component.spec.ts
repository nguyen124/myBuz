import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemeVideoComponent } from './meme-video.component';

describe('MemeVideoComponent', () => {
  let component: MemeVideoComponent;
  let fixture: ComponentFixture<MemeVideoComponent>;

  beforeEach(async(() => {
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
