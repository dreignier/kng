import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodexSectionComponent } from './codex-section.component';

describe('CodexSectionComponent', () => {
  let component: CodexSectionComponent;
  let fixture: ComponentFixture<CodexSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodexSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodexSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
