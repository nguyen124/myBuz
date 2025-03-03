import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SaveLoginComponent } from './save-login.component';

describe('SaveLoginComponent', () => {
  let component: SaveLoginComponent;
  let fixture: ComponentFixture<SaveLoginComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
