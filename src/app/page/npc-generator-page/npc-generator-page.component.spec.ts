import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NpcGeneratorPageComponent } from './npc-generator-page.component'

describe('NpcGeneratorPageComponent', () => {
  let component: NpcGeneratorPageComponent;
  let fixture: ComponentFixture<NpcGeneratorPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NpcGeneratorPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NpcGeneratorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
