import {
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
export class SliderComponent implements OnInit {
  @ViewChild('slider', { static: true }) slider!: ElementRef;

  isDragging: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  handleMousedown() {
    this.isDragging = true;
    console.log('mousedown');
  }

  handleMousemove() {
    if (!this.isDragging) return;
    console.log('mousemove');
  }

  handleMouseup() {
    this.isDragging = false;
    console.log('mouseup');
  }
}
