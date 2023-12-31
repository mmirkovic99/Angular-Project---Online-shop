import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent implements OnInit, AfterViewInit {
  private totalSize!: number;
  @Input() product!: any;
  @ViewChild('productElement', { static: true }) productElement!: ElementRef;

  constructor(private router: Router) {}

  ngOnInit(): void {}
  ngAfterViewInit() {
    const nativeElement = this.productElement.nativeElement;
    const styles = window.getComputedStyle(nativeElement);
    const marginLeft = parseInt(styles.marginLeft);
    const marginRight = parseInt(styles.marginRight);
    const cardWidth = this.productElement.nativeElement.offsetWidth;
    this.totalSize = cardWidth + marginLeft + marginRight;
  }

  getWidth(): number {
    return this.totalSize;
  }

  navigateProduct(id: number) {
    this.router.navigate([`product/${id}`]);
  }
}
