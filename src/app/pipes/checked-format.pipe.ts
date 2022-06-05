import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'checkedFormat',
})
export class CheckedFormatPipe implements PipeTransform {
  transform(value: boolean | undefined): unknown {
    return value ? 'Enabled' : 'Not enabled';
  }
}
