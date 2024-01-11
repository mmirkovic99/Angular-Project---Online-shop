import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'svg-icon',
  templateUrl: './svg-icon.component.html',
  styleUrls: ['./svg-icon.component.scss'],
})
export class SvgIconComponent {
  @Input()
  path!: string;
}
