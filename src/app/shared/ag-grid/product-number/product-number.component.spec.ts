import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductNumberComponent } from './product-number.component';

describe('ProductNumberComponent', () => {
  let component: ProductNumberComponent;
  let fixture: ComponentFixture<ProductNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductNumberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
