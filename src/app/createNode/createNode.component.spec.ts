import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateNodeComponent } from './createNode.component';

describe('UploadComponent', () => {
  let component: CreateNodeComponent;
  let fixture: ComponentFixture<CreateNodeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateNodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
