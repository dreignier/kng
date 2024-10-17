import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsCreatorPageComponent } from './news-creator-page.component';

describe('NewsCreatorPageComponent', () => {
  let component: NewsCreatorPageComponent;
  let fixture: ComponentFixture<NewsCreatorPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsCreatorPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsCreatorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
