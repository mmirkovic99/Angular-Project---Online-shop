import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
})
export class CustomInputComponent implements OnInit {
  @Input() label!: string;
  @Input() type!: 'text' | 'password';
  @Input() control: FormControl = new FormControl();
  @Input() error?: boolean;
  ngOnInit(): void {
    console.log(this.error);
  }
}
