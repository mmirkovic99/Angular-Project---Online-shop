import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTimeComponent } from './product-time.component';

describe('ProductTimeComponent', () => {
  let component: ProductTimeComponent;
  let fixture: ComponentFixture<ProductTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductTimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
