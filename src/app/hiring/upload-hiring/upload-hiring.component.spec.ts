import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadHiringComponent } from './upload-hiring.component';

describe('UploadHiringComponent', () => {
  let component: UploadHiringComponent;
  let fixture: ComponentFixture<UploadHiringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadHiringComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadHiringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
