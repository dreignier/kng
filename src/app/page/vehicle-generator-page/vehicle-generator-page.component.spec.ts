import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleGeneratorPageComponent } from './vehicle-generator-page.component';

describe('VehicleGeneratorPageComponent', () => {
  let component: VehicleGeneratorPageComponent;
  let fixture: ComponentFixture<VehicleGeneratorPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleGeneratorPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleGeneratorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
