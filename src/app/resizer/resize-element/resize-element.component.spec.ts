import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizeElementComponent } from './resize-element.component';

describe('ResizeElementComponent', () => {
  let component: ResizeElementComponent;
  let fixture: ComponentFixture<ResizeElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResizeElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResizeElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
