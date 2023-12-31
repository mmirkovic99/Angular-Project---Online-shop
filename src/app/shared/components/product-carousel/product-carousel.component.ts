import {
  Component,
  ElementRef,
  Input,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-product-carousel',
  templateUrl: './product-carousel.component.html',
  styleUrls: ['./product-carousel.component.scss'],
})
export class ProductCarouselComponent implements OnInit {
  private cardWidth!: number;
  private counter: number = 0;
  @Input() products!: any[];
  @ViewChild('slider', { static: false }) slider!: ElementRef;
  @ViewChildren(ProductCardComponent) cards!: QueryList<ProductCardComponent>;

  disabledButtons: boolean[] = [false, true];

  constructor() {}

  ngOnInit(): void {}

  handleClick(event: any) {
    const button = event.target.closest('custom-button');
    if (!button) return;
    this.cardWidth = this.cards.first.getWidth();
    const action: string = button.dataset.action;
    this.counter = action.includes('left')
      ? this.counter + 1
      : this.counter - 1;
    this.slide(action, this.slider, this.counter);
  }

  private slide(action: string, slider: ElementRef, counter: number) {
    const direction = action.includes('left') ? 1 : -1;
    slider.nativeElement.scrollLeft += direction * this.cardWidth;
    this.updateButtons(counter, 3);
  }

  private updateButtons(counter: number, cardsPerView: number) {
    const isAtStart = counter === 0;
    const isAtEnd = this.cards.length - cardsPerView === counter;
    this.disabledButtons = [isAtEnd, isAtStart];
  }
}
