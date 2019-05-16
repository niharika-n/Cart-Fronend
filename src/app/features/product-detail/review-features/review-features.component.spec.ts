import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewFeaturesComponent } from './review-features.component';

describe('ReviewFeaturesComponent', () => {
  let component: ReviewFeaturesComponent;
  let fixture: ComponentFixture<ReviewFeaturesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewFeaturesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
