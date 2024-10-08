import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstantsPageComponent } from './constants-page.component';

describe('ConstantsPageComponent', () => {
  let component: ConstantsPageComponent;
  let fixture: ComponentFixture<ConstantsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConstantsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConstantsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
