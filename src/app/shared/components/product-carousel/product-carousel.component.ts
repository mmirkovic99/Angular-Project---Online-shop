import {
  Component,
  ElementRef,
  Input,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';

@Component({
  selector: 'app-product-carousel',
  templateUrl: './product-carousel.component.html',
  styleUrls: ['./product-carousel.component.scss'],
})
export class ProductCarouselComponent implements OnInit {
  @Input() products!: any[];
  @ViewChild('slider', { static: true }) slider!: ElementRef;
  @ViewChildren('cards') cards!: QueryList<ElementRef>;

  constructor() {}

  slideLeft() {
    console.log(this.slider.nativeElement);
    this.cards.forEach((card: ElementRef) => console.log(card));
  }

  ngOnInit(): void {}
}
