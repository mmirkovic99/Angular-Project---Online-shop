import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.scss'],
})
export class CustomSelectComponent implements OnInit {
  @Input() options: string[] = [];
  @Input() selectedOption: string = '';
  @Output() optionSelected = new EventEmitter<string>();
  @ViewChild('arrow', { static: false }) arrow!: ElementRef;
  showOptionsList: boolean = false;

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {}

  toggleOptionsList(): void {
    this.showOptionsList = !this.showOptionsList;
    this.renderer[this.showOptionsList ? 'addClass' : 'removeClass'](
      this.arrow.nativeElement,
      'select__container__selected-option__icon--active'
    );
  }

  handleOptionClick(option: string): void {
    this.selectedOption = option;
    this.showOptionsList = false;
    this.optionSelected.emit(option);
  }
}
