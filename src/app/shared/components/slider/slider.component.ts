import {
  AfterContentInit,
  AfterViewChecked,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';

@Component({
  selector: 'slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class SliderComponent implements OnInit, AfterContentInit {
  @ViewChild('slider', { static: false }) slider!: ElementRef;
  constructor() {}
  ngAfterContentInit(): void {
    this.startSlider();
  }

  ngOnInit(): void {}

  startSlider(): void {
    setInterval(() => {
      if (
        this.slider.nativeElement.scrollLeft ===
        this.slider.nativeElement.scrollWidth -
          this.slider.nativeElement.firstChild.firstChild.clientWidth
      ) {
        this.slider.nativeElement.scrollLeft = 0;
      } else {
        this.slider.nativeElement.scrollLeft +=
          this.slider.nativeElement.firstChild.firstChild.clientWidth;
      }
    }, 3000);
  }
}
