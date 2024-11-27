import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodexContentComponent } from './codex-content.component';

describe('CodexContentComponent', () => {
  let component: CodexContentComponent;
  let fixture: ComponentFixture<CodexContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodexContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodexContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
