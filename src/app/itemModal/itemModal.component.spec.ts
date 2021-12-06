import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ItemModalComponent } from './itemModal.component';

describe('ItemComponent', () => {
  let component: ItemModalComponent;
  let fixture: ComponentFixture<ItemModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
