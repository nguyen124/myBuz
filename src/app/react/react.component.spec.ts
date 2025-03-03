import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReactComponent } from './react.component';

describe('ReactComponent', () => {
  let component: ReactComponent;
  let fixture: ComponentFixture<ReactComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
