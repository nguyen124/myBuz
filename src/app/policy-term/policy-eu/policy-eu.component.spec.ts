import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyEuComponent } from './policy-eu.component';

describe('PolicyEuComponent', () => {
  let component: PolicyEuComponent;
  let fixture: ComponentFixture<PolicyEuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyEuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyEuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
