import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubConfirmationComponent } from './sub-confirmation.component';

describe('ConfirmationComponent', () => {
  let component: SubConfirmationComponent;
  let fixture: ComponentFixture<SubConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
