import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsElementFormComponent } from './news-element-form.component';

describe('NewsElementFormComponent', () => {
  let component: NewsElementFormComponent;
  let fixture: ComponentFixture<NewsElementFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsElementFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsElementFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
