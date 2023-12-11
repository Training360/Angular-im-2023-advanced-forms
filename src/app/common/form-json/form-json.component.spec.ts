import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormJsonComponent } from './form-json.component';

describe('FormJsonComponent', () => {
  let component: FormJsonComponent;
  let fixture: ComponentFixture<FormJsonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormJsonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormJsonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
