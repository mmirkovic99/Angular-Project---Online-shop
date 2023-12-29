import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'custom-button',
  templateUrl: './custom-button.component.html',
  styleUrls: ['./custom-button.component.scss'],
})
export class CustomButtonComponent implements OnInit {
  @Input() buttonText!: string;
  @Input() buttonClass!: string;
  @Input() disabled?: boolean;
  @Output() onClick = new EventEmitter<string>();
  constructor() {}

  ngOnInit(): void {}

  emitEvent() {
    this.onClick.emit('test');
  }
}
