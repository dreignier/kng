import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentGeneratorPageComponent } from './equipment-generator-page.component';

describe('EquipmentGeneratorPageComponent', () => {
  let component: EquipmentGeneratorPageComponent;
  let fixture: ComponentFixture<EquipmentGeneratorPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquipmentGeneratorPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquipmentGeneratorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
