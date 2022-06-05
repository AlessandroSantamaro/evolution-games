import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ButtonStyles } from '../../../models/styles/buttons.model';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit {
  @Input() id: string = 'button_' + Math.random() * 1000;
  @Input() label: string = '';
  @Input() disabled: boolean = false;
  @Input() type: string = 'text';
  @Input() style: ButtonStyles = ButtonStyles.basic;
  @Output() onClick = new EventEmitter<null>();

  constructor() {}

  ngOnInit(): void {}

  buttonClick(): void {
    this.onClick.emit();
  }
}
