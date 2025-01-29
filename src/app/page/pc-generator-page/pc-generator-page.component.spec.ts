import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PcGeneratorPageComponent } from './pc-generator-page.component';

describe('PcGeneratorPageComponent', () => {
  let component: PcGeneratorPageComponent;
  let fixture: ComponentFixture<PcGeneratorPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PcGeneratorPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PcGeneratorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
