import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiringItemsComponent } from './hiring-items.component';

describe('HiringItemsComponent', () => {
  let component: HiringItemsComponent;
  let fixture: ComponentFixture<HiringItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HiringItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HiringItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
