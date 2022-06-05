import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckedFormatPipe } from '../pipes/checked-format.pipe';
import { ButtonComponent } from '../components/common/button/button.component';

@NgModule({
  declarations: [CheckedFormatPipe, ButtonComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    CheckedFormatPipe,
    ButtonComponent,
  ],
})
export class SharedModule {}
