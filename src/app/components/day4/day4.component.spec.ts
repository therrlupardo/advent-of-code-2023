import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Day4Component } from './day4.component';

describe('Day4Component', () => {
  let component: Day4Component;
  let fixture: ComponentFixture<Day4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Day4Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Day4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
