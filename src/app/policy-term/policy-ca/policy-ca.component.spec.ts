import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyCaComponent } from './policy-ca.component';

describe('PolicyCaComponent', () => {
  let component: PolicyCaComponent;
  let fixture: ComponentFixture<PolicyCaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyCaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyCaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
