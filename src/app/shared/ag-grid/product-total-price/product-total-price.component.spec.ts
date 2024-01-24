import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTotalPriceComponent } from './product-total-price.component';

describe('ProductTotalPriceComponent', () => {
  let component: ProductTotalPriceComponent;
  let fixture: ComponentFixture<ProductTotalPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductTotalPriceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductTotalPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
