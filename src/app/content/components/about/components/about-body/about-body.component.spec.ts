import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AboutBodyComponent } from './about-body.component';

describe('AboutBodyComponent', () => {
  let component: AboutBodyComponent;
  let fixture: ComponentFixture<AboutBodyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutBodyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
